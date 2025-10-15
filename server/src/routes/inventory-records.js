import express from "express";
import PDFDocument from "pdfkit";
import XLSX from "xlsx";
import InventoryRecordModel from "../schema/inventory-record.js";
const router = express.Router();
/**
 * Helper: Mark expired records
 */
const checkAndMarkExpiredRecords = async (records) => {
    const now = new Date();
    for (const record of records) {
        if (!record.expiration)
            continue;
        const expDate = new Date(record.expiration);
        // Only update if the record is not already expired and the date has passed
        if (!isNaN(expDate.getTime()) && !record.isExpired && expDate < now) {
            record.isExpired = true;
            record.status = "expired";
            // Update in DB
            await InventoryRecordModel.findByIdAndUpdate(record._id, {
                isExpired: true,
                status: "expired",
            }).catch(console.error);
        }
    }
    return records;
};
/**
 * GET all records by userId
 */
router.get("/getAllByUserID/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }
        // ✅ Get all user records
        const records = await InventoryRecordModel.find({ userId });
        const updatedRecords = await checkAndMarkExpiredRecords(records);
        return res.status(200).json(updatedRecords);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch inventory records" });
    }
});
/**
 * POST - create record
 */
router.post("/create", async (req, res) => {
    try {
        const recordData = req.body;
        const isExpired = new Date(recordData.expiration) < new Date();
        const newRecord = new InventoryRecordModel({
            ...recordData,
            status: isExpired ? "expired" : "active",
            isExpired,
        });
        const savedRecord = await newRecord.save();
        return res.status(201).json(savedRecord);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create inventory record" });
    }
});
/**
 * PUT - update record
 */
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.expiration) {
            updateData.isExpired = new Date(updateData.expiration) < new Date();
            updateData.status = updateData.isExpired ? "expired" : "active";
        }
        const updatedRecord = await InventoryRecordModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ error: "Record not found" });
        }
        return res.status(200).json(updatedRecord);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update inventory record" });
    }
});
/**
 * DELETE record
 */
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecord = await InventoryRecordModel.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ error: "Record not found" });
        }
        return res.status(200).json({ message: "Inventory record deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete inventory record" });
    }
});
/**
 * --- EXPORT EXCEL ---
 */
router.get("/export/excel", async (req, res) => {
    try {
        const userId = req.query.userId;
        const query = userId ? { userId } : {};
        // ✅ Fetch records (no .lean() needed)
        const records = await InventoryRecordModel.find(query);
        const worksheet = XLSX.utils.json_to_sheet(records.map((r) => r.toObject()));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", "attachment; filename=inventory.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Failed to export Excel");
    }
});
/**
 * --- EXPORT PDF ---
 */
router.get("/export/pdf", async (req, res) => {
    try {
        const userId = req.query.userId;
        const query = userId ? { userId } : {};
        // ✅ Fetch records (no .lean())
        const records = await InventoryRecordModel.find(query);
        const doc = new PDFDocument({ margin: 30, size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=inventory.pdf");
        res.flushHeaders();
        doc.pipe(res);
        doc.fontSize(20).text("📦 Inventory Report", { align: "center" });
        doc.moveDown();
        records.forEach((rec, index) => {
            doc
                .fontSize(12)
                .text(`${index + 1}. ${rec.description || "-"} | SKU: ${rec.sku || "-"} | Qty: ${rec.quantity ?? 0} | Exp: ${rec.expiration ? new Date(rec.expiration).toLocaleDateString() : "N/A"} | Status: ${rec.status || "active"}`);
        });
        doc.end();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Failed to export PDF");
    }
});
export default router;
//# sourceMappingURL=inventory-records.js.map