import express from "express";
import TodoTaskModel from "../schema/todo-tasks.js";
const router = express.Router();
/** GET /getAll/:userId — all tasks */
router.get("/getAll/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await TodoTaskModel.find({ userId }).sort({ taskDate: -1 });
        return res.json(tasks);
    }
    catch (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
    }
});
/** ✅ GET /getByDate/:userId/:date — tasks by specific date */
router.get("/getByDate/:userId/:date", async (req, res) => {
    try {
        const { userId, date } = req.params;
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const tasks = await TodoTaskModel.find({
            userId,
            taskDate: { $gte: start, $lte: end },
        }).sort({ createdAt: -1 });
        return res.json(tasks);
    }
    catch (err) {
        console.error("Error fetching tasks by date:", err);
        return res.status(500).json({ error: "Failed to fetch tasks by date" });
    }
});
/** ✅ GET /searchByDate/:userId?query=...&date=... */
router.get("/searchByDate/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { query, date } = req.query;
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const tasks = await TodoTaskModel.find({
            userId,
            taskDate: { $gte: start, $lte: end },
            title: { $regex: query || "", $options: "i" },
        }).sort({ createdAt: -1 });
        return res.json(tasks);
    }
    catch (err) {
        console.error("Error searching tasks:", err);
        return res.status(500).json({ error: "Failed to search tasks" });
    }
});
/** ✅ POST /add — create task for specific date */
router.post("/add", async (req, res) => {
    try {
        const { userId, title, taskDate } = req.body;
        if (!userId || !title || !taskDate) {
            return res.status(400).json({ error: "Missing userId, title or taskDate" });
        }
        const newTask = new TodoTaskModel({
            userId,
            title,
            taskDate: new Date(taskDate),
            done: false,
        });
        await newTask.save();
        return res.json({ message: "Task added successfully", task: newTask });
    }
    catch (err) {
        console.error("Error adding task:", err);
        return res.status(500).json({ error: "Failed to add task" });
    }
});
/** PUT /toggle/:id */
router.put("/toggle/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TodoTaskModel.findById(id);
        if (!task)
            return res.status(404).json({ error: "Task not found" });
        task.done = !task.done;
        await task.save();
        return res.json({ message: "Task updated", task });
    }
    catch (err) {
        console.error("Error toggling task:", err);
        return res.status(500).json({ error: "Failed to toggle task" });
    }
});
/** PUT /edit/:id */
router.put("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, taskDate } = req.body;
        const updated = await TodoTaskModel.findByIdAndUpdate(id, { title, taskDate: taskDate ? new Date(taskDate) : undefined }, { new: true });
        if (!updated)
            return res.status(404).json({ error: "Task not found" });
        return res.json({ message: "Task updated", task: updated });
    }
    catch (err) {
        console.error("Error editing task:", err);
        return res.status(500).json({ error: "Failed to edit task" });
    }
});
/** DELETE /delete/:id */
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await TodoTaskModel.findByIdAndDelete(id);
        return res.json({ message: "Task deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting task:", err);
        return res.status(500).json({ error: "Failed to delete task" });
    }
});
/** DELETE /clearAll/:userId */
router.delete("/clearAll/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        await TodoTaskModel.deleteMany({ userId });
        return res.json({ message: "All tasks cleared" });
    }
    catch (err) {
        console.error("Error clearing tasks:", err);
        return res.status(500).json({ error: "Failed to clear tasks" });
    }
});
export default router;
//# sourceMappingURL=todo-tasks.js.map