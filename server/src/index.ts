import 'dotenv/config'; // Load environment variables from .env
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import inventoryRecordRouter from "./routes/inventory-records.js";
import financialRecordRouter from "./routes/financial-records.js";
import { checkExpiringInventory } from "./utils/checkExpiration.js";
import workScheduleRouter from "./routes/work-schedule.js";
import todoTaskRouter from "./routes/todo-tasks.js";
import userRoutes from "./routes/user.js";
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routers
app.use("/inventory-records", inventoryRecordRouter);
app.use("/financial-records", financialRecordRouter);
app.use("/work-schedule", workScheduleRouter);
app.use("/user", userRoutes);
app.use("/todo", todoTaskRouter);
// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI environment variable is not defined!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB", err));

// Scheduled job (runs every hour)
setInterval(() => {
  console.log("🕒 Checking for expiring inventory...");
  try {
    checkExpiringInventory();
  } catch (err) {
    console.error("❌ Error in expiration check:", err);
  }
}, 60 * 60 * 1000);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on PORT: ${port}`);
});
