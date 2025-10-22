import mongoose, { Schema } from "mongoose";
const todoTaskSchema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    taskDate: { type: Date, required: true }, // ✅ required date
}, { timestamps: true });
const TodoTaskModel = mongoose.model("TodoTask", todoTaskSchema);
export default TodoTaskModel;
//# sourceMappingURL=todo-tasks.js.map