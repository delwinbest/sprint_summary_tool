import { TeamCreatedEvent } from '@sprintsummarytool/common';
import { TeamCreatedListener } from '../team-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Team } from '../../../models/team';
import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';

const setup = async () => {
  // create instance of the listener
  const listener = new TeamCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TeamCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Team 01',
    status: TeamStatus.Active,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a team', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure the ticket was created
  const team = await Team.findById(data.id);
  expect(team).toBeDefined();
  expect(team!.name).toEqual(data.name);
});

it('acks the message', async () => {
  setup();
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure message was ack'd
  expect(msg.ack).toHaveBeenCalled();
});
