import express from 'express';
import type {Request,Response} from 'express'
import FinancialRecordModel from '../schema/financial-record.js';

const router = express.Router();

router.get("/getAllByUserID/:userId", async(req: Request, res: Response) =>{
    try {
        const userId = req.params.userId;
        const records = await FinancialRecordModel.find({userId: userId});
        if(records.length === 0){
            return res.status(404).send("No records found for the User")
        }
        res.status(200).send(records)
    } catch (err){
        res.status(500).send(err)

    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        console.log("📥 Incoming record:", req.body);

        // ✅ Convert date if it's a string
        if (req.body.date) {
            req.body.date = new Date(req.body.date);
        }

        const newRecord = new FinancialRecordModel(req.body);
        const savedRecord = await newRecord.save();

        res.status(201).json(savedRecord);
    } catch (err: any) {
        console.error("❌ POST /financial-records error:", err);

        // ✅ Handle validation errors gracefully
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors, // tells you exactly which fields are missing/invalid
            });
        }

        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/:id", async(req: Request, res: Response) =>{
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = await FinancialRecordModel.findByIdAndUpdate(id, newRecordBody, {new: true})
       
        if(!record) return res.status(404).send()

        res.status(200).send(record)
    } catch (err){
        res.status(500).send(err)

    }
});

router.delete("/:id", async(req: Request, res: Response) =>{
    try {
        const id = req.params.id;
        const record = await FinancialRecordModel.findByIdAndDelete(id);

        if(!record) return res.status(404).send()

        res.status(200).send(record)
    } catch (err){
        res.status(500).send(err)

    }
});

export default router;