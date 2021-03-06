import {
  HttpStatusCode,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sprintsummarytool/common';
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { Team } from '../models/team';
import { natsWrapper } from '../nats-wrapper';
import { TeamUpdatedPublisher } from '../events/publishers/team-updated-publisher';
import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';

const router = express.Router();

router.put(
  '/api/teams/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('Invalid Team ID'),
    body('name')
      .optional()
      .isString()
      .withMessage('Team name should be a string'),
    body('status')
      .optional()
      .isIn(Object.values(TeamStatus))
      .withMessage(`Status needs to be either ${Object.values(TeamStatus)}`),
    body('users.*').optional().isMongoId().withMessage('Invalid ID in array'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, status } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      throw new NotFoundError();
    }
    team.set({
      name: name ? name : team.name,
      status: status ? status : team.status,
    });
    await team.save();
    await new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      name: team.name,
      version: team.version,
      status: team.status,
    });
    res.status(HttpStatusCode.OK).send(team);
  },
);

export { router as updateTeamRouter };
