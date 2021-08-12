import { requireAuth } from '@sprintsummarytool/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/api/sprints',
  requireAuth,
  async (req: Request, res: Response) => {
    res.status(200).send({ success: true });
  },
);

export { router as newSprintRouter };
