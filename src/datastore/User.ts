import gstore from './gstore';

const { Schema } = gstore;

export interface UserModel {
  userId: string;
  email: string;
  name?: string;
  createdOn?: Date;
  modifiedOn?: Date;
}

const User = new Schema<UserModel>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String },
  createdOn: {
    type: Date,
    default: gstore.defaultValues.NOW,
  },
  modifiedOn: { type: Date },
});

export default gstore.model('User', User);
