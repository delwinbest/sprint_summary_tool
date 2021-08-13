import {
  HttpStatusCode,
  requireAuth,
  SprintStatus,
  validateRequest,
} from '@sprintsummarytool/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Sprint } from '../models/sprint';
import { SprintCreatedPublisher } from '../events/publishers/sprint-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/sprints',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Sprint Name is required'),
    body('duration')
      .isFloat({ gt: 0 })
      .withMessage('Sprint duration must be greater than 0.'),
    body('startDate').isDate().withMessage('Invalid start date (YYYY-MM-DD)'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, duration, startDate } = req.body;
    const sprint = Sprint.build({
      name,
      status: SprintStatus.Active,
      duration,
      startDate,
    });
    await sprint.save();
    await new SprintCreatedPublisher(natsWrapper.client).publish({
      id: sprint.id,
      version: sprint.version,
      name: sprint.name,
      status: sprint.status,
      duration: sprint.duration,
      startDate: sprint.startDate,
    });
    res.status(HttpStatusCode.CREATED).send(sprint);
  },
);

export { router as newSprintRouter };
