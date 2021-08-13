import {
  Publisher,
  Subjects,
  SprintCreatedEvent,
} from '@sprintsummarytool/common';

export class SprintCreatedPublisher extends Publisher<SprintCreatedEvent> {
  subject: Subjects.SprintCreated = Subjects.SprintCreated;
}
