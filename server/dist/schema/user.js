import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
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
}, { timestamps: true });
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
//# sourceMappingURL=user.js.map