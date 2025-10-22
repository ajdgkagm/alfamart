import mongoose, { Schema } from "mongoose";
const workScheduleSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    mon: { type: String, default: "" },
    tue: { type: String, default: "" },
    wed: { type: String, default: "" },
    thu: { type: String, default: "" },
    fri: { type: String, default: "" },
    sat: { type: String, default: "" },
    sun: { type: String, default: "" },
}, { timestamps: true });
const WorkScheduleModel = mongoose.model("WorkSchedule", workScheduleSchema);
export default WorkScheduleModel;
//# sourceMappingURL=work-schedule.js.map