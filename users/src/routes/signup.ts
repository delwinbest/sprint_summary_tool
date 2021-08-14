import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@sprintsummarytool/common';
import jwt from 'jsonwebtoken';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email address in use');
    }

    // Hash the password before storing
    // TODO: Has password

    //Create user
    const user = User.build({
      email,
      password,
      name,
    });

    //Save user to DB
    await user.save();

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
    await new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      name: user.name,
      email: user.email,
      version: user.version,
    });

    res.status(201).send(user);
  },
);

export { router as signupRouter };
