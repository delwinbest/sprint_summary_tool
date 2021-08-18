import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@sprintsummarytool/common';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENTID);

router.post(
  '/api/users/googleauth',
  [body('token').exists().notEmpty().withMessage('Token must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENTID,
    });
    //@ts-ignore
    const { name, email } = ticket.getPayload();

    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      //Create user
      const user = User.build({
        email,
        password:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        name,
      });

      //Save user to DB
      await user.save();

      // Publish new user event
      await new UserCreatedPublisher(natsWrapper.client).publish({
        id: user.id,
        name: user.name,
        email: user.email,
        version: user.version,
      });
    }

    existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Failed to store OAuth credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.JWT_KEY!, // Check for key in index.js
    );

    // Store it on the session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  },
);

export { router as googleAuthRouter };
