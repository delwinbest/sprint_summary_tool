import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  UserCreatedEvent,
} from '@sprintsummarytool/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';
import { Team } from '../../models/team';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, name, email, team: teamId, version } = data;

    const team = await Team.findById(teamId);
    const user = User.build({ id, name, email, team, version });
    await user.save();
    msg.ack();
  }
}
