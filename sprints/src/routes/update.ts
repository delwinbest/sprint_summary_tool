import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  SprintStatus,
} from '@sprintsummarytool/common';
import { Sprint } from '../models/sprint';
import { natsWrapper } from '../nats-wrapper';
import { SprintUpdatedPublisher } from '../events/publishers/sprint-updated-publisher';

const router = express.Router();

router.put(
  '/api/sprints/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('Invalid Sprint ID'),
    body('name')
      .optional()
      .isString()
      .withMessage('Sprint Name is required as a string'),
    body('duration')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Sprint duration must be greater than 0'),
    body('startDate')
      .optional()
      .isDate()
      .withMessage('Invalid start date (YYYY-MM-DD)'),
    body('status')
      .optional()
      .isIn(Object.values(SprintStatus))
      .withMessage(`Status needs to be either ${Object.values(SprintStatus)}`),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, duration, startDate, status } = req.body;
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      throw new NotFoundError();
    }
    sprint.set({
      name: name ? name : sprint.name,
      status: status ? status : sprint.status,
      duration: duration ? duration : sprint.duration,
      startDate: startDate ? startDate : sprint.startDate,
    });
    await sprint.save();
    await new SprintUpdatedPublisher(natsWrapper.client).publish({
      id: sprint.id,
      version: sprint.version,
      name: sprint.name,
      status: sprint.status,
      duration: sprint.duration,
      startDate: sprint.startDate,
    });
    res.send(sprint);
  },
);

export { router as updateSprintRouter };
