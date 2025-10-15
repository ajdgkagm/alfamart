import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecords } from "../../contexts/financial-record-context";
export const FinancialRecordForm = () => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const { addRecord } = useFinancialRecords();
    const { user } = useUser();
    const handleSubmit = (event) => {
        event.preventDefault();
        const newRecord = {
            userId: user?.id ?? "",
            date: new Date(),
            description,
            amount: parseFloat(amount),
            category,
            paymentMethod,
        };
        addRecord(newRecord);
        setDescription("");
        setAmount("");
        setCategory("");
        setPaymentMethod("");
    };
    return (_jsxs("div", { className: "form-card", children: [_jsx("h2", { className: "form-title", children: "\u2795 Add Financial Record" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Description" }), _jsx("input", { type: "text", required: true, className: "input", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "e.g. Grocery shopping" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Amount" }), _jsx("input", { type: "number", required: true, className: "input", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "e.g. 250" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Category" }), _jsxs("select", { required: true, className: "input", value: category, onChange: (e) => setCategory(e.target.value), children: [_jsx("option", { value: "", children: "Select a Category" }), _jsx("option", { value: "Food", children: "Food" }), _jsx("option", { value: "Rent", children: "Rent" }), _jsx("option", { value: "Salary", children: "Salary" }), _jsx("option", { value: "Utilities", children: "Utilities" }), _jsx("option", { value: "Entertainment", children: "Entertainment" }), _jsx("option", { value: "Other", children: "Other" })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Payment Method" }), _jsxs("select", { required: true, className: "input", value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), children: [_jsx("option", { value: "", children: "Select a Payment Method" }), _jsx("option", { value: "Credit Card", children: "Credit Card" }), _jsx("option", { value: "Cash", children: "Cash" }), _jsx("option", { value: "Bank Transfer", children: "Bank Transfer" })] })] }), _jsx("button", { type: "submit", className: "button button-primary", children: "Add Record" })] })] }));
};
