import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import { Sprint, SprintStatus } from '../../models/sprint';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';
import { HttpStatusCode } from '@sprintsummarytool/common';
import { Team } from '../../models/team';
import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';

const setup = async () => {
  const team = Team.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Team 01',
    status: TeamStatus.Active,
  });
  await team.save();
  const sprint = Sprint.build({
    name: 'Sprint 01',
    duration: 10,
    startDate: new Date(),
    status: SprintStatus.Active,
    team: team,
  });
  await sprint.save();
  return { sprint, team };
};

it('has a route handler listening to /api/sprints/:id for GET requests', async () => {
  const response = await request(app)
    .get(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .get(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .get(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('throws an error if the sprint ID does not exist', async () => {
  const response = await request(app)
    .get(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
});

it('throws an error if the sprint ID is malformed', async () => {
  const response = await request(app)
    .get(`/api/sprints/fwrt34fer`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
});

it('returns the sprints details', async () => {
  const { sprint, team } = await setup();
  const { body: returnedSprint } = await request(app)
    .get(`/api/sprints/${sprint.id}`)
    .set('Cookie', signin())
    .send({})
    .expect(HttpStatusCode.OK);
  expect(returnedSprint.id).toEqual(sprint.id);
  expect(returnedSprint.team.id).toEqual(team.id);
});
