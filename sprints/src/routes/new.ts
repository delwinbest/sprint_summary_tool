import {
  HttpStatusCode,
  NotFoundError,
  requireAuth,
  SprintStatus,
  validateRequest,
} from '@sprintsummarytool/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Sprint } from '../models/sprint';
import { SprintCreatedPublisher } from '../events/publishers/sprint-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Team } from '../models/team';

const router = express.Router();

router.post(
  '/api/sprints',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Sprint Name is required'),
    body('duration')
      .isFloat({ gt: 0 })
      .withMessage('Sprint duration must be greater than 0.'),
    body('startDate').isDate().withMessage('Invalid start date (YYYY-MM-DD)'),
    body('teamId').notEmpty().isMongoId().withMessage('Invalid Team ID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, duration, startDate, teamId } = req.body;
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team does not exist');
    }
    const sprint = Sprint.build({
      name,
      status: SprintStatus.Active,
      duration,
      startDate,
      team: team,
    });
    await sprint.save();
    await new SprintCreatedPublisher(natsWrapper.client).publish({
      id: sprint.id,
      version: sprint.version,
      name: sprint.name,
      status: sprint.status,
      duration: sprint.duration,
      startDate: sprint.startDate,
      team: {
        id: team.id,
        name: team.name,
      },
    });
    res.status(HttpStatusCode.CREATED).send(sprint);
  },
);

export { router as newSprintRouter };
