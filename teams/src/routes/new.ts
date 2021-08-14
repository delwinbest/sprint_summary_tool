import {
  HttpStatusCode,
  requireAuth,
  SprintStatus,
  validateRequest,
} from '@sprintsummarytool/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Team } from '../models/team';
import { TeamCreatedPublisher } from '../events/publishers/team-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/teams',
  requireAuth,
  [body('name').not().isEmpty().withMessage('Team Name is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const team = Team.build({
      name,
    });
    await team.save();
    await new TeamCreatedPublisher(natsWrapper.client).publish({
      id: team.id,
      name: team.name,
    });
    res.status(HttpStatusCode.CREATED).send(team);
  },
);

export { router as newTeamRouter };
