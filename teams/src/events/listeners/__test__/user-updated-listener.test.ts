import { UserUpdatedEvent } from '@sprintsummarytool/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { UserUpdatedListener } from '../user-updated-listener';
import { User } from '../../../models/user';
import { Team } from '../../../models/team';
import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';
import { UserRole } from '@sprintsummarytool/common/build/events/types/user-role';

const setup = async () => {
  //Create first version of User
  const user = User.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'User 01',
    email: 'test@test.com',
    team: null,
    status: UserStatus.Active,
    role: UserRole.Admin,
  });
  await user.save();
  // create instance of the listener
  const listener = new UserUpdatedListener(natsWrapper.client);
  // create a fake data event
  const data: UserUpdatedEvent['data'] = {
    id: user.id,
    name: 'Updated Username',
    version: 1,
    email: 'updateDecorator.com',
    status: UserStatus.Disabled,
    role: UserRole.User,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, user };
};

it('finds and updates the user', async () => {
  const { listener, data, msg, user } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure the ticket was created
  const updatedUser = await User.findById(user.id);
  expect(updatedUser).toBeDefined();
  expect(updatedUser!.version).toEqual(1);
  expect(updatedUser!.name).toEqual(data.name);
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, user, listener } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    expect(err).toBeDefined;
  }
  expect(msg.ack).not.toHaveBeenCalled();
});

it('does not call ack if a teamId does not match', async () => {
  const { msg, data, user, listener } = await setup();
  const fakeTeamId = mongoose.Types.ObjectId().toHexString();
  data.team = fakeTeamId;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    expect(err).toBeDefined;
  }
  const updatedUser = await User.findById(user.id);
  expect(updatedUser).toBeDefined();
  expect(updatedUser!.version).toEqual(0);
  expect(msg.ack).not.toHaveBeenCalled();
});

it('finds and maps team to user if provided', async () => {
  const { msg, data, user, listener } = await setup();
  const team = Team.build({
    name: 'Team 01',
    status: TeamStatus.Active,
  });
  await team.save();
  data.team = team.id;
  await listener.onMessage(data, msg);
  const updatedUser = await User.findById(user.id);
  expect(updatedUser).toBeDefined();
  expect(updatedUser!.version).toEqual(1);
  expect(updatedUser!.name).toEqual(data.name);
});

it('acks the message', async () => {
  setup();
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure message was ack'd
  expect(msg.ack).toHaveBeenCalled();
});
