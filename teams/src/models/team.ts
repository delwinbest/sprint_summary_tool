import mongoose from 'mongoose';

interface TeamAttrs {
  name: string;
}

export interface TeamDoc extends mongoose.Document {
  name: string;
  version: number;
}

//Interface the describes properties that Sprint Model has
interface TeamModel extends mongoose.Model<TeamDoc> {
  build(attrs: TeamAttrs): TeamDoc;
}

const teamSchema = new mongoose.Schema(
  {
    name: {
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
  return new Team(attrs);
};

teamSchema.pre('save', function (done) {
  this.set('version', this.get('version') + 1);
  done();
});

const Team = mongoose.model<TeamDoc, TeamModel>('Team', teamSchema);

export { Team };
