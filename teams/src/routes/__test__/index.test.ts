import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import mongoose from 'mongoose';
import { Team } from '../../models/team';
import { HttpStatusCode } from '@sprintsummarytool/common';
import { User } from '../../models/user';

const setup = async () => {
  const team = Team.build({
    name: 'Team 01',
  });
  await team.save();
  const teamWithMembers = Team.build({
    name: 'Team 02',
  });
  await teamWithMembers.save();
  const user01 = User.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'User 01',
    email: 'user01.test.com',
    version: 0,
    team: teamWithMembers,
  });
  await user01.save();
  const user02 = User.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'User 02',
    email: 'user02.test.com',
    version: 0,
    team: teamWithMembers,
  });
  await user02.save();
  return { team, teamWithMembers, user01, user02 };
};

it('has a route handler listening to /api/team for get requests', async () => {
  const response = await request(app).get(`/api/teams`).send({});
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .get(`/api/teams`)
    .send({})
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .get(`/api/teams`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('returns all teams', async () => {
  await setup();
  const { body: returnedTeams } = await request(app)
    .get(`/api/teams`)
    .set('Cookie', signin())
    .send({});
  expect(returnedTeams.length).toEqual(2);
});

it('returns all teams with members', async () => {
  const { team, teamWithMembers } = await setup();
  const { body: returnedTeams } = await request(app)
    .get(`/api/teams`)
    .set('Cookie', signin())
    .send({});
  expect(returnedTeams.length).toEqual(2);
  expect(returnedTeams[1].members.length).toEqual(2);
});
