import express, { Request, Response } from 'express';
import { requireAuth } from '@sprintsummarytool/common';
import { Team } from '../models/team';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/teams', requireAuth, async (req: Request, res: Response) => {
  const teams = await Team.find({});

  const response = await Promise.all(
    teams.map(async function (team) {
      const members = await User.find({ team: team });
      return { team, members };
    }),
  );
  res.send(response);
});

export { router as indexTeamRouter };
