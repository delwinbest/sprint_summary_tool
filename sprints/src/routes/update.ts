import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@sprintsummarytool/common';
import { Sprint } from '../models/sprint';
// import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publiser';
import { natsWrapper } from '../nats-wrapper';

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
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, duration, startDate, status } = req.body;
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      throw new NotFoundError();
    }

    /// TODO : Finish this!
    // sprint.set({
    //   name,
    //   status,
    //   duration,
    //   startDate,
    // });
    // await sprint.save();
    // new TicketUpdatedPublisher(natsWrapper.client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    //   version: ticket.version,
    // });
    res.send(sprint);
  },
);

export { router as updateSprintRouter };
