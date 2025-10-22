import mongoose, { Document } from "mongoose";
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
    userId: string;
    preferences?: IUserPref;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default UserModel;
//# sourceMappingURL=user.d.ts.map