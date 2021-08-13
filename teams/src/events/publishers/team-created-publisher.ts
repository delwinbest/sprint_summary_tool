import {
  Publisher,
  Subjects,
  TeamCreatedEvent,
} from '@sprintsummarytool/common';

export class TeamCreatedPublisher extends Publisher<TeamCreatedEvent> {
  subject: Subjects.TeamCreated = Subjects.TeamCreated;
}
