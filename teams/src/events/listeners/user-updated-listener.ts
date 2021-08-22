import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  UserUpdatedEvent,
} from '@sprintsummarytool/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';
import { Team } from '../../models/team';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const { id, version, name, team: teamId, email, status, role } = data;
    let team = null;
    const user = await User.findByEvent({
      id,
      version,
    });
    if (teamId) {
      team = await Team.findById(teamId);
      if (!team) {
        throw new Error('Team ID not found');
      }
    }
    if (!user) {
      console.log('User ID or version dont match, ignoring');
    } else {
      user.set({ name, version, team, email, status, role });
      await user.save();
      msg.ack();
    }
  }
}
