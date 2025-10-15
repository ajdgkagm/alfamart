import mongoose, { Document } from "mongoose";
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
declare const InventoryRecordModel: mongoose.Model<InventoryRecord, {}, {}, {}, mongoose.Document<unknown, {}, InventoryRecord, {}, {}> & InventoryRecord & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default InventoryRecordModel;
//# sourceMappingURL=inventory-record.d.ts.map