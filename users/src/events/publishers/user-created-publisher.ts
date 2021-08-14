import {
  Publisher,
  Subjects,
  UserCreatedEvent,
} from '@sprintsummarytool/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
