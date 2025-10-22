import mongoose, { Document, Schema } from "mongoose";

export interface WorkSchedule extends Document {
  userId: string;
  name: string;
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const workScheduleSchema = new Schema<WorkSchedule>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    mon: { type: String, default: "" },
    tue: { type: String, default: "" },
    wed: { type: String, default: "" },
    thu: { type: String, default: "" },
    fri: { type: String, default: "" },
    sat: { type: String, default: "" },
    sun: { type: String, default: "" },
  },
  { timestamps: true }
);

const WorkScheduleModel = mongoose.model<WorkSchedule>(
  "WorkSchedule",
  workScheduleSchema
);

export default WorkScheduleModel;
