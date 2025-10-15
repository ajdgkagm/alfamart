import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useInventoryRecords } from "./contexts/inventory-record-context";
import "./InventoryRecordForm.css";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { InventoryRecordList } from "./InventoryRecordList";
export const InventoryRecordForm = () => {
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [amount, setAmount] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [expiration, setExpiration] = useState("");
    const [remarks, setRemarks] = useState("");
    const { addRecord } = useInventoryRecords();
    const { user } = useUser();
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user?.id)
            return;
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
    const handleDownload = (type) => {
        if (!user?.id)
            return;
        const url = `http://localhost:3001/inventory-records/export/${type}?userId=${user.id}`;
        window.open(url, "_blank");
    };
    return (_jsxs("div", { className: "form-card", children: [_jsx("h2", { children: "\uD83D\uDCE6 Add Inventory Record" }), _jsxs("form", { className: "form-grid", onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Invoice #" }), _jsx("input", { type: "text", className: "input", placeholder: "e.g. INV-2025-01", value: invoiceNumber, onChange: (e) => setInvoiceNumber(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "SKU / PLU" }), _jsx("input", { type: "text", className: "input", placeholder: "e.g. SKU-10045", value: sku, onChange: (e) => setSku(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Description" }), _jsx("input", { type: "text", className: "input", placeholder: "e.g. Broiler Feed 50kg", value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Quantity" }), _jsx("input", { type: "number", className: "input", placeholder: "e.g. 10", value: quantity, onChange: (e) => setQuantity(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Amount" }), _jsx("input", { type: "number", className: "input", placeholder: "e.g. 250", value: amount, onChange: (e) => setAmount(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Total Cost" }), _jsx("input", { type: "number", className: "input", placeholder: "e.g. 2500", value: totalCost, onChange: (e) => setTotalCost(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Expiration / RH" }), _jsx("input", { type: "date", className: "input", value: expiration, onChange: (e) => setExpiration(e.target.value) })] }), _jsxs("div", { className: "form-field form-field-full", children: [_jsx("label", { children: "Remarks" }), _jsx("input", { type: "text", className: "input", placeholder: "Optional notes", value: remarks, onChange: (e) => setRemarks(e.target.value) })] }), _jsx("div", { className: "form-field form-field-full", children: _jsx("button", { type: "submit", className: "button button-primary", children: "Add Inventory" }) })] }), user?.id && (_jsx(_Fragment, { children: _jsx(InventoryRecordList, { userId: user.id }) }))] }));
};
