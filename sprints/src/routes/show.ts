import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
} from '@sprintsummarytool/common';
import { Sprint } from '../models/sprint';

const router = express.Router();

router.get(
  '/api/sprints/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const sprint = await Sprint.findById(req.params.id).populate('team');
      if (!sprint) {
        throw new NotFoundError();
      }
      res.send(sprint);
    } catch (error) {
      throw new NotFoundError();
    }
  },
);

export { router as showSprintRouter };
