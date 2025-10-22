import express, { Request, Response } from "express";
import UserModel from "../schema/user.js";

const router = express.Router();

// Create user
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: "name and userId required" });
    }
    const exists = await UserModel.findOne({ userId });
    if (exists) return res.status(400).json({ error: "userId already exists" });

    const user = new UserModel({ name, userId });
    const saved = await user.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// Get all users
router.get("/getAll", async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find().sort({ name: 1 });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user preferences (per-day)
router.put("/preferences/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const prefs = req.body.preferences;
    const updated = await UserModel.findByIdAndUpdate(id, { preferences: prefs }, { new: true });
    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update preferences" });
  }
});

export default router;
