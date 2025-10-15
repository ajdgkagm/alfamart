import mongoose from "mongoose";
interface FinancialRecord {
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}
declare const FinancialRecordModel: mongoose.Model<FinancialRecord, {}, {}, {}, mongoose.Document<unknown, {}, FinancialRecord, {}, {}> & FinancialRecord & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default FinancialRecordModel;
//# sourceMappingURL=financial-record.d.ts.map