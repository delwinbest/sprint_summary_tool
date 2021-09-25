import express, { Request, Response } from 'express';
import { requireAuth } from '@sprintsummarytool/common';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/users', requireAuth, async (req: Request, res: Response) => {
  const allUsers = await User.find({});
  res.send(allUsers);
});

export { router as indexUserRouter };
