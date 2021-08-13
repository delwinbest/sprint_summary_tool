import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  SprintStatus,
  BadRequestError,
} from '@sprintsummarytool/common';
import { Sprint } from '../models/sprint';
import { natsWrapper } from '../nats-wrapper';
import { SprintUpdatedPublisher } from '../events/publishers/sprint-updated-publisher';
import mongoose from 'mongoose';

const router = express.Router();

router.put(
  '/api/sprints/:id',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Sprint Name is required'),
    body('duration')
      .isFloat({ gt: 0 })
      .withMessage('Sprint duration must be greater than 0'),
    body('startDate').isDate().withMessage('Invalid start date (YYYY-MM-DD)'),
    body('status')
      .isIn(Object.values(SprintStatus))
      .withMessage(
        `Status cannot be empty and needs to be either ${Object.values(
          SprintStatus,
        )}`,
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, duration, startDate, status } = req.body;
    try {
      const sprint = await Sprint.findById(req.params.id);
      if (!sprint) {
        throw new NotFoundError();
      }
      sprint.set({
        name,
        status,
        duration,
        startDate,
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
    } catch (error) {
      throw new BadRequestError('Invalid Sprint ID or Request to DB');
    }
  },
);

export { router as updateSprintRouter };
