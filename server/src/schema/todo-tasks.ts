import mongoose, { Document, Schema } from "mongoose";

export interface ITodoTask extends Document {
  userId: string;
  title: string;
  done: boolean;
  taskDate: Date; // ✅ new field for the scheduled date
  createdAt?: Date;
  updatedAt?: Date;
}

const todoTaskSchema = new Schema<ITodoTask>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    taskDate: { type: Date, required: true }, // ✅ required date
  },
  { timestamps: true }
);

const TodoTaskModel = mongoose.model<ITodoTask>("TodoTask", todoTaskSchema);
export default TodoTaskModel;
