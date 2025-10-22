import mongoose, { Document, Schema } from "mongoose";

export interface IUserPref {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface IUser extends Document {
  name: string;
  userId: string; // unique id, e.g. user_123
  preferences?: IUserPref; // per-day preferred shift or 'rd'
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    preferences: {
      mon: { type: String, default: "" },
      tue: { type: String, default: "" },
      wed: { type: String, default: "" },
      thu: { type: String, default: "" },
      fri: { type: String, default: "" },
      sat: { type: String, default: "" },
      sun: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
