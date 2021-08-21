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
    const { id, version, name, status } = data;

    const team = await Team.findByEvent({
      id: data.id,
      version: data.version,
    });
    if (!team) {
      console.log('Team ID or version dont match, ignoring');
    } else {
      team.set({ name, version, status });
      await team.save();
      msg.ack();
    }
  }
}
