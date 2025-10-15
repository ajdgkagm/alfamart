import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
// eslint-disable-next-line
import { useTable } from "react-table";
import { useInventoryRecords } from "./contexts/inventory-record-context";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const EditableCell = ({ value: initialValue, rowIndex, columnId, updateRecord, editable, }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
        setIsEditing(false);
        updateRecord(rowIndex, columnId, value);
    };
    return (_jsx("div", { onClick: () => editable && setIsEditing(true), style: { cursor: editable ? "pointer" : "default" }, children: isEditing ? (_jsx("input", { value: value ?? "", onChange: (e) => setValue(e.target.value), autoFocus: true, onBlur: onBlur, className: "editable-input" })) : (value?.toString() ?? "") }));
};
// Helper to format date as MM/DD/YYYY
const formatDate = (date) => {
    if (!date)
        return "";
    const d = new Date(date);
    if (isNaN(d.getTime()))
        return "";
    return d.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
};
export const InventoryRecordList = ({ userId }) => {
    const { inventoryRecords, updateRecord } = useInventoryRecords();
    const [filter, setFilter] = useState("");
    // Filter by userId
    const userRecords = useMemo(() => inventoryRecords.filter((record) => record.userId === userId), [inventoryRecords, userId]);
    // Calculate status and daysLeft
    const calculateStatus = (expiration) => {
        if (!expiration)
            return { status: "active", daysLeft: "N/A" };
        const now = new Date();
        const expDate = new Date(expiration);
        const diffDays = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0)
            return { status: "expired", daysLeft: diffDays };
        if (diffDays <= 10)
            return { status: "expiring_soon", daysLeft: diffDays };
        return { status: "active", daysLeft: diffDays };
    };
    // Records with status calculated automatically
    const recordsWithStatus = useMemo(() => {
        const order = { expired: 0, expiring_soon: 1, active: 2 };
        return userRecords
            .map((record) => ({ ...record, ...calculateStatus(record.expiration) }))
            .sort((a, b) => order[a.status] - order[b.status]);
    }, [userRecords]);
    // Apply search filter
    const filteredRecords = useMemo(() => {
        if (!filter.trim())
            return recordsWithStatus;
        const lower = filter.toLowerCase();
        return recordsWithStatus.filter((record) => Object.values(record).some((val) => val?.toString().toLowerCase().includes(lower)));
    }, [recordsWithStatus, filter]);
    // Update cell value
    const updateCellRecord = (rowIndex, columnId, value) => {
        const id = filteredRecords[rowIndex]._id;
        updateRecord(id ?? "", { ...filteredRecords[rowIndex], [columnId]: value });
    };
    // Export PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [
                ["Invoice #", "SKU", "Description", "Quantity", "Amount", "Total Cost", "Arrival", "Expiration", "Days Left", "Remarks", "Status"],
            ],
            body: filteredRecords.map((r) => [
                r.invoiceNumber,
                r.sku,
                r.description,
                r.quantity,
                r.amount,
                r.totalCost,
                formatDate(r.dateOfArrival),
                formatDate(r.expiration),
                r.daysLeft,
                r.remarks,
                r.status.toUpperCase(),
            ]),
        });
        doc.save("inventory_records.pdf");
    };
    // Export Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRecords.map((r) => ({
            "Invoice #": r.invoiceNumber,
            SKU: r.sku,
            Description: r.description,
            Quantity: r.quantity,
            Amount: r.amount,
            "Total Cost": r.totalCost,
            "Date of Arrival": formatDate(r.dateOfArrival),
            Expiration: formatDate(r.expiration),
            "Days Left": r.daysLeft,
            Remarks: r.remarks,
            Status: r.status.toUpperCase(),
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
        XLSX.writeFile(workbook, "inventory_records.xlsx");
    };
    // Table columns
    const columns = useMemo(() => [
        { Header: "Invoice #", accessor: "invoiceNumber" },
        { Header: "SKU", accessor: "sku" },
        { Header: "Description", accessor: "description" },
        { Header: "Quantity", accessor: "quantity" },
        { Header: "Amount", accessor: "amount" },
        { Header: "Total Cost", accessor: "totalCost" },
        { Header: "Date of Arrival", accessor: "dateOfArrival", Cell: ({ value }) => _jsx("span", { children: formatDate(value) }) },
        { Header: "Expiration", accessor: "expiration", Cell: ({ value }) => _jsx("span", { children: formatDate(value) }) },
        { Header: "Days Left", accessor: "daysLeft", Cell: ({ value }) => (_jsx("span", { style: { color: typeof value === "number" ? (value <= 0 ? "red" : value <= 10 ? "orange" : "green") : "black" }, children: typeof value === "number" ? (value <= 0 ? "Expired" : `${value} days`) : value })) },
        { Header: "Remarks", accessor: "remarks" },
        { Header: "Status", accessor: "status", Cell: ({ value }) => (_jsx("span", { style: { color: value === "expired" ? "red" : value === "expiring_soon" ? "orange" : "green", fontWeight: "bold" }, children: value.replace("_", " ").toUpperCase() })) },
    ], [filteredRecords]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: filteredRecords });
    return (_jsxs("div", { className: "table-card", children: [_jsx("h2", { className: "table-title", children: "\uD83D\uDCE6 Inventory Records" }), _jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "1rem" }, children: [_jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Search by any field...", value: filter, onChange: (e) => setFilter(e.target.value), className: "filter-input", style: { flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", marginRight: "0.5rem" } }), _jsxs("div", { style: { display: "flex", gap: "6px" }, children: [_jsx("button", { onClick: exportToPDF, style: { backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "0.85rem" }, children: "\uD83D\uDCC4 PDF" }), _jsx("button", { onClick: exportToExcel, style: { backgroundColor: "#5cb85c", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "0.85rem" }, children: "\uD83D\uDCCA Excel" })] })] }), _jsxs("table", { ...getTableProps(), className: "styled-table", children: [_jsx("thead", { children: headerGroups.map(headerGroup => (_createElement("tr", { ...headerGroup.getHeaderGroupProps(), key: headerGroup.id }, headerGroup.headers.map(column => (_createElement("th", { ...column.getHeaderProps(), key: column.id }, column.render("Header"))))))) }), _jsx("tbody", { ...getTableBodyProps(), children: rows.map(row => {
                            prepareRow(row);
                            const status = row.original.status;
                            const rowStyle = status === "expired" ? { backgroundColor: "#ffe6e6" } : status === "expiring_soon" ? { backgroundColor: "#fff5e6" } : {};
                            return (_createElement("tr", { ...row.getRowProps(), key: row.id, style: rowStyle }, row.cells.map(cell => (_createElement("td", { ...cell.getCellProps(), key: cell.column.id }, cell.render("Cell"))))));
                        }) })] })] }));
};
