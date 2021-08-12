import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@sprintsummarytool/common';
import { Sprint } from '../models/sprint';

const router = express.Router();

router.get(
  '/api/sprints/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      throw new NotFoundError();
    }
    res.send(sprint);
  },
);

export { router as showSprintRouter };
