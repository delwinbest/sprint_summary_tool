import {
  Publisher,
  Subjects,
  SprintUpdatedEvent,
} from '@sprintsummarytool/common';

export class SprintUpdatedPublisher extends Publisher<SprintUpdatedEvent> {
  subject: Subjects.SprintUpdated = Subjects.SprintUpdated;
}
