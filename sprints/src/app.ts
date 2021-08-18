import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';
import cors from 'cors';
import { healthzRouter } from './routes/healthz';
import { newSprintRouter } from './routes/new';
import { indexSprintRouter } from './routes';
import { showSprintRouter } from './routes/show';
import { updateSprintRouter } from './routes/update';

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
app.use(newSprintRouter);
app.use(indexSprintRouter);
app.use(showSprintRouter);
app.use(updateSprintRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
