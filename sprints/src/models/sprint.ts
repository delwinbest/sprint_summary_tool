import mongoose from 'mongoose';
import { SprintStatus } from '@sprintsummarytool/common';
export { SprintStatus };

interface SprintAttrs {
  name: string;
  status: SprintStatus;
  startDate: Date;
  duration: number;
}

interface SprintDoc extends mongoose.Document {
  name: string;
  status: SprintStatus;
  startDate: Date;
  duration: number;
  version: number;
}

//Interface the describes properties that Sprint Model has
interface SprintModel extends mongoose.Model<SprintDoc> {
  build(attrs: SprintAttrs): SprintDoc;
}

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(SprintStatus),
      default: SprintStatus.Active,
    },
    startDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

sprintSchema.set('versionKey', 'version');
// Statics is to add a method directly to the model itself
sprintSchema.statics.build = (attrs: SprintAttrs) => {
  return new Sprint(attrs);
};

sprintSchema.pre('save', function (done) {
  this.set('version', this.get('version') + 1);
  done();
});

const Sprint = mongoose.model<SprintDoc, SprintModel>('Sprint', sprintSchema);

export { Sprint };
