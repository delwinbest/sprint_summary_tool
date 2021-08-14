import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TeamUpdatedEvent,
} from '@sprintsummarytool/common';
import { queueGroupName } from './queue-group-name';
import { Team } from '../../models/team';

export class TeamUpdatedListener extends Listener<TeamUpdatedEvent> {
  subject: Subjects.TeamUpdated = Subjects.TeamUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TeamUpdatedEvent['data'], msg: Message) {
    const { id, version, name } = data;

    const team = await Team.findByEvent({
      id: data.id,
      version: data.version,
    });
    if (!team) {
      throw new Error('Team not found');
    }
    team.set({ name, version });
    await team.save();

    msg.ack();
  }
}
