import mongoose from 'mongoose';
import { TeamDoc } from './team';

// An interface that descibes the new user properties
interface UserAttrs {
  id: string;
  version: number;
  email: string;
  name: string;
  team?: TeamDoc | null;
}

// Interface that describes the properties that a user DOCUMENT has
// (mongoose DB document has additional properties)
interface UserDoc extends mongoose.Document {
  email: string;
  name: string;
  team?: TeamDoc | null;
  version: number;
}

//Interface the describes properties that User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
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

// Needed when using a provided ID as you map incoming ID to DB _ID
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    name: attrs.name,
    email: attrs.email,
    team: attrs.team,
  });
};

userSchema.set('versionKey', 'version');

userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
