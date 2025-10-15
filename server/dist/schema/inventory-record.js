import mongoose, { Schema } from "mongoose";
const inventoryRecordSchema = new Schema({
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
const InventoryRecordModel = mongoose.model("InventoryRecord", inventoryRecordSchema);
export default InventoryRecordModel;
//# sourceMappingURL=inventory-record.js.map