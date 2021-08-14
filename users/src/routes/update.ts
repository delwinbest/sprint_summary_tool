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
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import jwt from 'jsonwebtoken';

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
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, teamId, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError();
    }
    if (req.currentUser?.id !== user.id) {
      throw new NotAuthorizedError();
    }

    const team = await Team.findById(teamId);
    user.set({
      name: name ? name : user.name,
      team: team ? team : user.team,
      email: email ? email : user.email,
      password: password ? password : user.password,
    });
    await user.save();
    await new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      name: user.name,
      version: user.version,
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
