import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sprintsummarytool/common';
import { Team } from '../models/team';

const router = express.Router();

router.get(
  '/api/teams/:id',
  requireAuth,
  [param('id').isMongoId().withMessage('Invaid Team ID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
      throw new NotFoundError();
    }
    res.send(team);
  },
);

export { router as showTeamRouter };
