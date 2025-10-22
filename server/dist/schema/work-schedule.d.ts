import mongoose, { Document } from "mongoose";
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
declare const WorkScheduleModel: mongoose.Model<WorkSchedule, {}, {}, {}, mongoose.Document<unknown, {}, WorkSchedule, {}, {}> & WorkSchedule & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default WorkScheduleModel;
//# sourceMappingURL=work-schedule.d.ts.map