import mongoose, { Document } from "mongoose";
export interface ITodoTask extends Document {
    userId: string;
    title: string;
    done: boolean;
    taskDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const TodoTaskModel: mongoose.Model<ITodoTask, {}, {}, {}, mongoose.Document<unknown, {}, ITodoTask, {}, {}> & ITodoTask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default TodoTaskModel;
//# sourceMappingURL=todo-tasks.d.ts.map