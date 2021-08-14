import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@sprintsummarytool/common';
import { User } from '../models/user';
import { Team } from '../models/team';

const router = express.Router();

router.put(
  '/api/users/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('Invalid User ID'),
    body('name')
      .optional()
      .isString()
      .withMessage('Sprint Name is required as a string'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('teamId').optional().isMongoId().withMessage('Invalid Team ID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, teamId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError();
    }
    if (req.currentUser?.id !== user.id) {
      throw new NotAuthorizedError();
    }
    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        throw new Error('Team does not exists');
      }
    }
    user.set({
      name: name ? name : user.name,
      team: teamId ? teamId : user.team,
      email: email ? email : user.email,
    });
    await user.save();
    res.send(user);
  },
);

export { router as updateUserRouter };
