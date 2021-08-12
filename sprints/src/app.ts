import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';

import { healthzRouter } from './routes/healthz';

import { errorHandler, NotFoundError } from '@drbtickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookiesession({
    signed: false,
    secure: false,
  }),
);
app.use(healthzRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
