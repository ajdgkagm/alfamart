import { useInventoryRecords } from "./contexts/inventory-record-context";
import "./InventoryRecordForm.css";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { InventoryRecordList } from "./InventoryRecordList";

export const InventoryRecordForm = () => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [expiration, setExpiration] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const { addRecord } = useInventoryRecords();
  const { user } = useUser();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;

    const newRecord = {
      userId: user.id,
      dateOfArrival: new Date().toISOString(),
      invoiceNumber,
      sku,
      description,
      quantity: parseFloat(quantity) || 0,
      amount: parseFloat(amount) || 0,
      totalCost: parseFloat(totalCost) || 0,
      expiration,
      remarks,
    };

    addRecord(newRecord);

    // Reset form fields
    setInvoiceNumber("");
    setSku("");
    setDescription("");
    setQuantity("");
    setAmount("");
    setTotalCost("");
    setExpiration("");
    setRemarks("");
  };

  // File download helper with userId query
  const handleDownload = (type: "excel" | "pdf") => {
    if (!user?.id) return;
    const url = `https://alfamart-7.onrender.com/inventory-records/export/${type}?userId=${user.id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="form-card">
      <h2>📦 Add Inventory Record</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Invoice #</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. INV-2025-01"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>SKU / PLU</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. SKU-10045"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Description</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Broiler Feed 50kg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Quantity</label>
          <input
            type="number"
            className="input"
            placeholder="e.g. 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Amount</label>
          <input
            type="number"
            className="input"
            placeholder="e.g. 250"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Total Cost</label>
          <input
            type="number"
            className="input"
            placeholder="e.g. 2500"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Expiration / RH</label>
          <input
            type="date"
            className="input"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
          />
        </div>

        <div className="form-field form-field-full">
          <label>Remarks</label>
          <input
            type="text"
            className="input"
            placeholder="Optional notes"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="form-field form-field-full">
          <button type="submit" className="button button-primary">
            Add Inventory
          </button>
        </div>
      </form>

      {user?.id && (
        <>
          

          <InventoryRecordList userId={user.id} />
        </>
      )}
    </div>
  );
};
