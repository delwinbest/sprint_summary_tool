import { TeamCreatedEvent, UserCreatedEvent } from '@sprintsummarytool/common';
import { UserCreatedListener } from '../user-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Team } from '../../../models/team';
import { User } from '../../../models/user';

const setup = async () => {
  // create instance of the listener
  const listener = new UserCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: UserCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'User 01',
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a user', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure the ticket was created
  const user = await User.findById(data.id);
  expect(user).toBeDefined();
  expect(user!.name).toEqual(data.name);
});

it('acks the message', async () => {
  setup();
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure message was ack'd
  expect(msg.ack).toHaveBeenCalled();
});
