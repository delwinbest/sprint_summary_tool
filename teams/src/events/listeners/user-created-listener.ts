import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  UserCreatedEvent,
} from '@sprintsummarytool/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, name } = data;

    const user = User.build({ id, name });
    await user.save();

    msg.ack();
  }
}
