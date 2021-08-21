import mongoose from 'mongoose';
import { Sprint } from '../sprint';
import { SprintStatus } from '@sprintsummarytool/common';
import { Team } from '../team';
import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';

it('increments the version number on multiple saves', async () => {
  // Create a team
  const team = Team.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Team 01',
    status: TeamStatus.Active,
  });
  await team.save();
  // Create a Sprint
  const sprint = Sprint.build({
    name: 'Sprint 01',
    status: SprintStatus.Active,
    startDate: new Date(),
    duration: 10,
    team: team,
  });
  // Save the ticket to the DB
  await sprint.save();
  expect(sprint.version).toEqual(0);
  await sprint.save();
  expect(sprint.version).toEqual(1);
  await sprint.save();
  expect(sprint.version).toEqual(2);
  await sprint.save();
  expect(sprint.version).toEqual(3);
});
