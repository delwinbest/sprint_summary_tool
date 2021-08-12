import mongoose from 'mongoose';

interface SprintAttrs {
  name: string;
  startDate: Date;
  duration: number;
  status: string;
}

interface SprintDoc extends mongoose.Document {
  name: string;
  startDate: Date;
  duration: number;
  status: string;
  version: number;
}
