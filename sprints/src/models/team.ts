import { TeamStatus } from '@sprintsummarytool/common/build/events/types/team-status';
import mongoose from 'mongoose';

interface TeamAttrs {
  id: string;
  name: string;
  status: TeamStatus;
}

export interface TeamDoc extends mongoose.Document {
  id: string;
  name: string;
  version: number;
  status: TeamStatus;
}

//Interface the describes properties that Sprint Model has
interface TeamModel extends mongoose.Model<TeamDoc> {
  build(attrs: TeamAttrs): TeamDoc;
  findByEvent(event: { id: string; version: number }): Promise<TeamDoc | null>;
}

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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

teamSchema.set('versionKey', 'version');
// Statics is to add a method directly to the model itself
teamSchema.statics.build = (attrs: TeamAttrs) => {
  return new Team({ _id: attrs.id, name: attrs.name, status: attrs.status });
};

teamSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Team.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Team = mongoose.model<TeamDoc, TeamModel>('Team', teamSchema);

export { Team };
