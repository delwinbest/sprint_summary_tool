import { HttpStatusCode } from '@sprintsummarytool/common';
import express from 'express';

const router = express.Router();

router.get('/api/sprints/healthz', (req, res) => {
  res.status(HttpStatusCode.OK).send({});
});

export { router as healthzRouter };
