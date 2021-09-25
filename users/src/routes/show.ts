import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import {
  currentUser,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sprintsummarytool/common';
import { User } from '../models/user';

const router = express.Router();

router.get(
  '/api/users/:id',
  requireAuth,
  [param('id').isMongoId().withMessage('Invaid User ID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError();
    }
    res.send(user);
  },
);

export { router as showUserRouter };
