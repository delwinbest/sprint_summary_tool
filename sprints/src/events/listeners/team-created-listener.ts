import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TeamCreatedEvent,
} from '@sprintsummarytool/common';
import { queueGroupName } from './queue-group-name';
import { Team } from '../../models/team';

export class TeamCreatedListener extends Listener<TeamCreatedEvent> {
  subject: Subjects.TeamCreated = Subjects.TeamCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TeamCreatedEvent['data'], msg: Message) {
    const { id, version, name } = data;

    const team = Team.build({ id, name, version });
    await team.save();

    msg.ack();
  }
}
