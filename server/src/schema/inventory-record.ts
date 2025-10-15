import mongoose, { Document, Schema } from "mongoose";

export interface InventoryRecord extends Document {
  userId: string;
  invoiceNumber?: string;
  dateOfArrival?: Date;
  sku?: string;
  description?: string;
  quantity?: number;
  amount?: number;
  totalCost?: number;
  expiration?: Date;
  remarks?: string;
  status?: string;
  isExpired?: boolean;
}

const inventoryRecordSchema = new Schema<InventoryRecord>({
  userId: { type: String, required: true },
  invoiceNumber: String,
  dateOfArrival: Date,
  sku: String,
  description: String,
  quantity: Number,
  amount: Number,
  totalCost: Number,
  expiration: Date,
  remarks: String,
  status: { type: String, default: "active" },
  isExpired: { type: Boolean, default: false },
});

const InventoryRecordModel = mongoose.model<InventoryRecord>(
  "InventoryRecord",
  inventoryRecordSchema
);

export default InventoryRecordModel;
