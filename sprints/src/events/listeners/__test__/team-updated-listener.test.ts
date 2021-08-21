import { TeamUpdatedEvent } from '@sprintsummarytool/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Team } from '../../../models/team';
import { TeamUpdatedListener } from '../team-updated-listener';
import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';

const setup = async () => {
  //Create first version of Team
  const team = Team.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Team Name',
    status: TeamStatus.Active,
  });
  await team.save();
  // create instance of the listener
  const listener = new TeamUpdatedListener(natsWrapper.client);
  // create a fake data event
  const data: TeamUpdatedEvent['data'] = {
    id: team.id,
    name: 'Updated Team Name',
    status: TeamStatus.Archived,
    version: 1,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, team };
};

it('finds and updates the team', async () => {
  const { listener, data, msg, team } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure the ticket was created
  const updatedTeam = await Team.findById(team.id);
  expect(updatedTeam).toBeDefined();
  expect(updatedTeam!.version).toEqual(1);
  expect(updatedTeam!.name).toEqual(data.name);
  expect(updatedTeam!.status).toEqual(data.status);
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, team, listener } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    expect(err).toBeDefined;
  }
  expect(msg.ack).not.toHaveBeenCalled();
});

it('acks the message', async () => {
  setup();
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // write assertions to make sure message was ack'd
  expect(msg.ack).toHaveBeenCalled();
});
