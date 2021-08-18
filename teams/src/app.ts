import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';
import cors from 'cors';
import { healthzRouter } from './routes/healthz';
import { newTeamRouter } from './routes/new';

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sprintsummarytool/common';
import { showTeamRouter } from './routes/show';
import { updateTeamRouter } from './routes/update';

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
app.use(newTeamRouter);
app.use(showTeamRouter);
app.use(updateTeamRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
