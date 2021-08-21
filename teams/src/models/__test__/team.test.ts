import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';
import { Team } from '../team';

it('increments the version number on multiple saves', async () => {
  // Create a ticket
  const team = Team.build({
    name: 'Team 01',
    status: TeamStatus.Active,
  });
  // Save the ticket to the DB
  await team.save();
  expect(team.version).toEqual(0);
  await team.save();
  expect(team.version).toEqual(1);
  await team.save();
  expect(team.version).toEqual(2);
  await team.save();
  expect(team.version).toEqual(3);
});
