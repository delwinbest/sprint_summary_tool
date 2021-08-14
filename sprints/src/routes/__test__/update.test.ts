import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import { Sprint, SprintStatus } from '../../models/sprint';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';
import { HttpStatusCode } from '@sprintsummarytool/common';
import { Team } from '../../models/team';

const setup = async () => {
  const team = Team.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Team 01',
    version: 0,
  });
  await team.save();
  const sprint = Sprint.build({
    name: 'Sprint 01',
    duration: 10,
    startDate: new Date(),
    status: SprintStatus.Active,
    team: team.id,
  });
  await sprint.save();
  return { sprint };
};

it('has a route handler listening to /api/sprints/:id for put requests', async () => {
  const response = await request(app)
    .put(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .send({
      name: 'Sprint 03',
      duration: 12,
      startDate: '2022-01-01',
      status: SprintStatus.Cancelled,
    });
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .put(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .send({
      name: 'Sprint 03',
      duration: 12,
      startDate: '2022-01-01',
      status: SprintStatus.Cancelled,
    })
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', signin())
    .send({
      name: 'Sprint 03',
      duration: 12,
      startDate: '2022-01-01',
      status: SprintStatus.Cancelled,
    });
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('throws an error if the sprint ID does not exist', async () => {
  const response = await request(app)
    .post(`/api/sprints/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', signin())
    .send({});
  expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
});

it('throws an error if the sprint ID is malformed', async () => {
  const response = await request(app)
    .put(`/api/sprints/fwrt34fer`)
    .set('Cookie', signin())
    .send({
      name: 'Sprint 03',
      duration: 12,
      startDate: '2022-01-01',
      status: SprintStatus.Cancelled,
    });
  expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
});

it('throws a bad request error if the request body is invalid', async () => {
  const { sprint } = await setup();
  await request(app)
    .put(`/api/sprints/${sprint!.id}`)
    .set('Cookie', signin())
    .send({
      name: 'Sprint 03',
      duration: 12,
      startDate: 'INCORRECT_DATE',
      status: SprintStatus.Cancelled,
    })
    .expect(HttpStatusCode.BAD_REQUEST);
  await request(app)
    .put(`/api/sprints/${sprint!.id}`)
    .set('Cookie', signin())
    .send({
      name: 'Sprint 03',
      duration: 'TYPO',
      startDate: '2021-12-31',
      status: SprintStatus.Cancelled,
    })
    .expect(HttpStatusCode.BAD_REQUEST);
  await request(app)
    .put(`/api/sprints/${sprint!.id}`)
    .set('Cookie', signin())
    .send({
      name: 'Sprint 03',
      duration: 12,
      startDate: '2021-12-31',
      status: 'TYPO',
    })
    .expect(HttpStatusCode.BAD_REQUEST);
});

it('increments version number with each update', async () => {
  const { sprint } = await setup();
  sprint.set({ status: SprintStatus.Complete });
  await sprint.save();
  await request(app)
    .put(`/api/sprints/${sprint!.id}`)
    .set('Cookie', signin())
    .send({
      name: 'Sprint 03',
      duration: 12,
      status: SprintStatus.Cancelled,
    })
    .expect(HttpStatusCode.OK);
  const updatedSprint = await Sprint.findById(sprint.id);
  expect(updatedSprint!.version).toEqual(2);
});

// it('emits an sprint:updated event', async () => {
//   const { sprint } = await setup();
//   await request(app)
//     .put(`/api/sprints/${sprint!.id}`)
//     .set('Cookie', signin())
//     .send({
//       name: 'Sprint 03',
//       duration: 12,
//       startDate: '2021-12-31',
//       status: SprintStatus.Cancelled,
//     })
//     .expect(HttpStatusCode.OK);
//   expect(natsWrapper.client.publish).toHaveBeenCalled();
//   expect((natsWrapper.client.publish as jest.Mock).mock.calls[0][0]).toEqual(
//     'sprint:updated',
//   );
// });
