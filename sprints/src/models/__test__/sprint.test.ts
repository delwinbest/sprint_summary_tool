import mongoose from 'mongoose';
import { Sprint } from '../sprints';
import { SprintStatus } from '@sprintsummarytool/common';

it('increments the version number on multiple saves', async () => {
  // Create a ticket
  const sprint = Sprint.build({
    name: 'Sprint 01',
    status: SprintStatus.Active,
    startDate: new Date(),
    duration: 10,
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
