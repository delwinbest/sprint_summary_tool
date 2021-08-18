import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';
import cors from 'cors';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { healthzRouter } from './routes/healthz';
import { updateUserRouter } from './routes/update';
import { googleAuthRouter } from './routes/googleauth';

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sprintsummarytool/common';

const app = express();
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: true,
    }),
  );
}
app.set('trust proxy', true);
app.use(json());
app.use(
  cookiesession({
    signed: false,
    secure: false,
  }),
);
app.use(healthzRouter);
app.use(currentUser);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(googleAuthRouter);
app.use(updateUserRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
