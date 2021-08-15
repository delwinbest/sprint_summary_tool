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

it('has a route handler listening to /api/team/ID for get requests', async () => {
  const { team } = await setup();
  const response = await request(app).get(`/api/teams/${team.id}`).send({});
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  const { team } = await setup();
  await request(app)
    .get(`/api/teams/${team.id}`)
    .send({})
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const { team } = await setup();
  const response = await request(app)
    .get(`/api/teams/${team.id}`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('returns a team when ID matches', async () => {
  const { team } = await setup();
  const { body: returnedTeam } = await request(app)
    .get(`/api/teams/${team.id}`)
    .set('Cookie', signin())
    .send({});
  expect(returnedTeam.team.id).toEqual(team.id);
});

it('returns all members when present', async () => {
  const { teamWithMembers } = await setup();
  const { body: returnedTeam } = await request(app)
    .get(`/api/teams/${teamWithMembers.id}`)
    .set('Cookie', signin())
    .send({});
  expect(returnedTeam.team.id).toEqual(teamWithMembers.id);
  expect(returnedTeam.members.length).toEqual(2);
  const user03 = User.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'User 03',
    email: 'user02.test.com',
    version: 0,
    team: teamWithMembers,
  });
  await user03.save();
  const { body: secondReturnedTeam } = await request(app)
    .get(`/api/teams/${teamWithMembers.id}`)
    .set('Cookie', signin())
    .send({});
  expect(secondReturnedTeam.team.id).toEqual(teamWithMembers.id);
  expect(secondReturnedTeam.members.length).toEqual(3);
});
