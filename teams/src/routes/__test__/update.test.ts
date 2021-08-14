import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import { Team } from '../../models/team';

import { natsWrapper } from '../../nats-wrapper';
import { HttpStatusCode } from '@sprintsummarytool/common';

const setup = async () => {
  const team = Team.build({
    name: 'Team Name',
  });
  await team.save();
  return { team };
};

it('has a route handler listening to /api/teams for post requests', async () => {
  const { team } = await setup();
  const response = await request(app).put(`/api/teams/${team.id}`).send({});
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  const { team } = await setup();
  await request(app)
    .put(`/api/teams/${team.id}`)
    .send({})
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const { team } = await setup();
  const response = await request(app)
    .put(`/api/teams/${team.id}`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('saves a change to the database and increments version number', async () => {
  const { team } = await setup();
  const requestData = {
    name: 'Updated Name',
  };

  const response = await request(app)
    .put(`/api/teams/${team.id}`)
    .set('Cookie', signin())
    .send(requestData)
    .expect(HttpStatusCode.OK);
  const updatedTeam = await Team.findById(response.body.id);
  expect(updatedTeam).toBeDefined();
  expect(updatedTeam!.name).toEqual(requestData.name);
  expect(updatedTeam!.version).toEqual(1);
});

it('emits an team updated event', async () => {
  const { team } = await setup();
  const requestData = {
    name: 'Updated Name',
  };

  const response = await request(app)
    .put(`/api/teams/${team.id}`)
    .set('Cookie', signin())
    .send(requestData)
    .expect(HttpStatusCode.OK);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
