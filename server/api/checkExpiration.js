import InventoryRecordModel from "../src/schema/inventory-record.js";
export async function checkExpiringInventory() {
    const now = new Date();
    // Fetch all records
    const records = await InventoryRecordModel.find();
    for (const record of records) {
        if (!record.expiration)
            continue;
        const expDate = new Date(record.expiration);
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let newStatus = record.status;
        if (diffDays <= 0) {
            newStatus = "expired";
        }
        else if (diffDays <= 3) {
            newStatus = "expiring_soon";
        }
        else {
            newStatus = "active";
        }
        if (newStatus !== record.status) {
            record.status = newStatus;
            await record.save();
            console.log(`Invoice ${record.invoiceNumber} is now marked as ${newStatus} (${diffDays} days left)`);
        }
    }
}
//# sourceMappingURL=checkExpiration.js.map