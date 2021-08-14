import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sprintsummarytool/common';
import { Sprint } from '../models/sprint';

const router = express.Router();

router.get(
  '/api/sprints/:id',
  requireAuth,
  [param('id').isMongoId().withMessage('Invaid Sprint ID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const sprint = await Sprint.findById(req.params.id).populate('team');
    if (!sprint) {
      throw new NotFoundError();
    }
    res.send(sprint);
  },
);

export { router as showSprintRouter };
