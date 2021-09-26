import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@sprintsummarytool/common';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { natsWrapper } from '../nats-wrapper';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';
import { UserRole } from '@sprintsummarytool/common/build/events/types/user-role';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENTID);

router.post(
  '/api/users/googleauth',
  [body('token').exists().notEmpty().withMessage('Token must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token } = req.body;
    let userRole = UserRole.User;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENTID,
    });
    //@ts-ignore
    const { name, email } = ticket.getPayload();

    // Is this the first User, and therefore admin?
    const totalUsers = await User.find({});
    if (totalUsers.length === 0) {
      // No other users, I am the first
      userRole = UserRole.Admin;
    }

    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      //Create user
      const user = User.build({
        email,
        password:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        name,
        status: UserStatus.Active,
        role: userRole,
      });

      //Save user to DB
      await user.save();

      // Publish new user event
      await new UserCreatedPublisher(natsWrapper.client).publish({
        id: user.id,
        name: user.name,
        email: user.email,
        status: UserStatus.Active,
        role: user.role,
      });
    }

    existingUser = await User.findOne({ email });
    if (existingUser.status !== UserStatus.Active) {
      throw new BadRequestError('Account either archived or inactive.');
    }
    if (!existingUser) {
      throw new BadRequestError('Failed to store OAuth credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
      process.env.JWT_KEY!, // Check for key in index.js
    );

    // Store it on the session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  },
);

export { router as googleAuthRouter };
