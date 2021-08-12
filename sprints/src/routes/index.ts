import express, { Response, Request } from 'express';
import { Sprint } from '../models/sprint';

const router = express.Router();

router.get('/api/sprints', async (req: Request, res: Response) => {
  const sprints = await Sprint.find({});
  res.send(sprints);
});

export { router as indexSprintRouter };
