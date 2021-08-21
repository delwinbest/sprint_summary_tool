import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@sprintsummarytool/common';
import { User } from '../models/user';
import { Team } from '../models/team';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import jwt from 'jsonwebtoken';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';

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
    body('password')
      .optional()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('status')
      .optional()
      .isIn(Object.values(UserStatus))
      .withMessage(`Status needs to be either ${Object.values(UserStatus)}`),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, teamId, password, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError();
    }
    if (req.currentUser?.id !== user.id) {
      throw new NotAuthorizedError();
    }
    user.set({
      name: name ? name : user.name,
      email: email ? email : user.email,
      password: password ? password : user.password,
      status: status ? status : user.status,
    });
    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        throw new BadRequestError('Invalid Team ID');
      }
      user.set({
        team: team ? team : user.team,
      });
    }
    await user.save();
    await new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      name: user.name,
      version: user.version,
      status: user.status,
      email: user.email,
      team: teamId,
    });

    // Replace session data with updated data
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY!, // Check for key in index.js
    );

    // Store it on the session object
    req.session = { jwt: userJwt };
    res.send(user);
  },
);

export { router as updateUserRouter };
