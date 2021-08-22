import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@sprintsummarytool/common';
import jwt from 'jsonwebtoken';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';
import { UserRole } from '@sprintsummarytool/common/build/events/types/user-role';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('name')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Name must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    let userRole = UserRole.User;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email address in use');
    }

    // Is this the first User, and therefore admin?
    const totalUsers = await User.find({});
    if (totalUsers.length === 0) {
      // No other users, I am the first
      userRole = UserRole.Admin;
    }

    //Create user
    const user = User.build({
      email,
      password,
      name,
      status: UserStatus.Active,
      role: userRole,
    });

    //Save user to DB
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_KEY!, // Check for key in index.js
    );

    // Store it on the session object
    req.session = { jwt: userJwt };
    await new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      name: user.name,
      email: user.email,
      status: UserStatus.Active,
      role: user.role,
    });

    res.status(201).send(user);
  },
);

export { router as signupRouter };
