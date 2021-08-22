import { UserRole } from '@sprintsummarytool/common/build/events/types/user-role';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';
import mongoose from 'mongoose';
import { Password } from '../services/password';
import { TeamDoc } from './team';

// An interface that descibes the new user properties
interface UserAttrs {
  email: string;
  password: string;
  name: string;
  status: UserStatus;
  role: UserRole;
  team?: TeamDoc;
}

// Interface that describes the properties that a user DOCUMENT has
// (mongoose DB document has additional properties)
interface UserDoc extends mongoose.Document {
  version: number;
  email: string;
  password: string;
  name: string;
  status: UserStatus;
  role: UserRole;
  team?: TeamDoc;
}

//Interface the describes properties that User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    role: {
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
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

// Intercept the save and perform this function
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Required to help typsescript and mongoose work
// Enables type checking by wrapping
userSchema.set('versionKey', 'version');
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', function (done) {
  this.set('version', this.get('version') + 1);
  done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
