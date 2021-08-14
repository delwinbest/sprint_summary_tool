import mongoose from 'mongoose';

// An interface that descibes the new user properties
interface UserAttrs {
  id: string;
  name: string;
}

//Interface the describes properties that User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface that describes the properties that a user DOCUMENT has
// (mongoose DB document has additional properties)
interface UserDoc extends mongoose.Document {
  name: string;
}

const userSchema = new mongoose.Schema(
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
        delete ret.__v;
      },
    },
  },
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({ _id: attrs.id, name: attrs.name });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
