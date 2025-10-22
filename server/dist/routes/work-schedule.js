import express from "express";
import WorkScheduleModel from "../schema/work-schedule.js";
import UserModel from "../schema/user.js";
const router = express.Router();
const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const shiftSlots = ["opening", "mid", "closing", "graveyard"];
/**
 * GET /getAll
 * Fetch all generated schedules
 */
router.get("/getAll", async (_req, res) => {
    try {
        const schedules = await WorkScheduleModel.find();
        return res.json(schedules);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch schedules" });
    }
});
/**
 * DELETE /clearAll
 * Clear all existing schedules
 */
router.delete("/clearAll", async (_req, res) => {
    try {
        await WorkScheduleModel.deleteMany({});
        return res.json({ message: "Cleared" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Clear failed" });
    }
});
/**
 * POST /generate
 * Generate weekly schedule respecting preferences.
 * Rules:
 * - Honors user’s chosen rest day if specified (rd)
 * - Max 2 users per shift per day
 * - Each user must have at least 1 rest day per week
 */
router.post("/generate", async (_req, res) => {
    try {
        const users = await UserModel.find();
        if (!users.length)
            return res.status(400).json({ error: "No users found" });
        // clear existing schedule
        await WorkScheduleModel.deleteMany({});
        const schedulesForUsers = {};
        const assignedCount = {};
        const userHasRest = {};
        // initialize user tracking
        users.forEach((u) => {
            schedulesForUsers[u.userId] = { mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" };
            assignedCount[u.userId] = 0;
            userHasRest[u.userId] = false;
        });
        // loop per day
        for (const day of days) {
            const shiftCount = {
                opening: 0,
                mid: 0,
                closing: 0,
                graveyard: 0,
                rd: 0,
            };
            const assignedThisDay = new Set();
            // 1️⃣ Assign preferred rest days first — users who chose "rd" keep it
            const rdCandidates = users.filter((u) => u.preferences?.[day]?.toLowerCase() === "rd");
            for (const u of rdCandidates) {
                schedulesForUsers[u.userId][day] = "rd";
                assignedThisDay.add(u.userId);
                shiftCount.rd++;
                userHasRest[u.userId] = true;
            }
            // 2️⃣ Assign users based on their preferred shift (opening, mid, closing, graveyard)
            for (const shift of shiftSlots) {
                const prefCandidates = users
                    .filter((u) => u.preferences?.[day]?.toLowerCase() === shift &&
                    !assignedThisDay.has(u.userId) &&
                    shiftCount[shift] < 2)
                    .sort((a, b) => assignedCount[a.userId] - assignedCount[b.userId]);
                for (const u of prefCandidates) {
                    if (shiftCount[shift] >= 2)
                        break;
                    schedulesForUsers[u.userId][day] = shift;
                    assignedThisDay.add(u.userId);
                    shiftCount[shift]++;
                    assignedCount[u.userId]++;
                }
            }
            // 3️⃣ Fill remaining users randomly and evenly
            for (const shift of shiftSlots) {
                const unassigned = users
                    .filter((u) => !assignedThisDay.has(u.userId))
                    .sort((a, b) => assignedCount[a.userId] - assignedCount[b.userId]);
                for (const u of unassigned) {
                    if (shiftCount[shift] >= 2)
                        break;
                    schedulesForUsers[u.userId][day] = shift;
                    assignedThisDay.add(u.userId);
                    shiftCount[shift]++;
                    assignedCount[u.userId]++;
                }
            }
        }
        // 4️⃣ Ensure each user has at least one rest day if they didn’t choose one
        users.forEach((u) => {
            if (!userHasRest[u.userId]) {
                const shuffledDays = [...days].sort(() => Math.random() - 0.5);
                for (const day of shuffledDays) {
                    const dayHasRd = Object.values(schedulesForUsers)
                        .map((s) => s[day])
                        .includes("rd");
                    if (!dayHasRd) {
                        schedulesForUsers[u.userId][day] = "rd";
                        userHasRest[u.userId] = true;
                        break;
                    }
                }
            }
        });
        // 5️⃣ Save schedules to database
        const inserted = await WorkScheduleModel.insertMany(Object.keys(schedulesForUsers).map((userId) => ({
            userId,
            name: users.find((u) => u.userId === userId)?.name || "",
            ...schedulesForUsers[userId],
        })));
        return res.json({ message: "Schedule generated", schedules: inserted });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to generate schedule" });
    }
});
export default router;
//# sourceMappingURL=work-schedule.js.map