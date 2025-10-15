import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import inventoryRecordRouter from "./routes/inventory-records.js"; // ✅ note .js
import financialRecordRouter from "./routes/financial-records.js"; // ✅ note .js
import { checkExpiringInventory } from "./utils/checkExpiration.js"; // ✅ note .js

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Mount routers
app.use("/inventory-records", inventoryRecordRouter);
app.use("/financial-records", financialRecordRouter);

// MongoDB connection
const mongoURI = "mongodb+srv://ajdgkagm:7Ho1xmtbavYGkrgf@personalfinancetracker.o7dsynl.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Schedule expiration check every hour
setInterval(() => {
  console.log("Checking for expiring inventory...");
  checkExpiringInventory();
}, 60 * 60 * 1000); // 1 hour

app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
