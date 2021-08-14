import {
  Publisher,
  Subjects,
  TeamUpdatedEvent,
} from '@sprintsummarytool/common';

export class TeamUpdatedPublisher extends Publisher<TeamUpdatedEvent> {
  subject: Subjects.TeamUpdated = Subjects.TeamUpdated;
}
