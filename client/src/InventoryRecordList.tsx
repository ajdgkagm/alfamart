// InventoryRecordList.tsx
import React, { useMemo, useState } from "react";
import { useTable, type Column } from "react-table";
import { useInventoryRecords, type InventoryRecord } from "./contexts/inventory-record-context";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface InventoryRecordListProps {
  userId: string;
}

// Format date as DD/MM/YYYY
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

type StatusType = "expired" | "expiring_soon" | "active";

export const InventoryRecordList: React.FC<InventoryRecordListProps> = ({ userId }) => {
  const { inventoryRecords, updateRecord, deleteRecord } = useInventoryRecords();
  const [filter, setFilter] = useState("");
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);

  const userRecords = useMemo(
    () => inventoryRecords.filter((r) => r.userId === userId),
    [inventoryRecords, userId]
  );

  const calculateStatus = (expiration?: string) => {
    if (!expiration) return { status: "active" as StatusType, daysLeft: "N/A" };
    const now = new Date();
    const expDate = new Date(expiration);
    const diffDays = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: "expired" as StatusType, daysLeft: diffDays };
    if (diffDays <= 10) return { status: "expiring_soon" as StatusType, daysLeft: diffDays };
    return { status: "active" as StatusType, daysLeft: diffDays };
  };

  const recordsWithStatus = useMemo(() => {
    const order: Record<StatusType, number> = { expired: 0, expiring_soon: 1, active: 2 };
    return userRecords
      .map((r) => ({ ...r, ...calculateStatus(r.expiration) }))
      .sort((a, b) => order[a.status] - order[b.status]);
  }, [userRecords]);

  const filteredRecords = useMemo(() => {
    if (!filter.trim()) return recordsWithStatus;
    const lower = filter.toLowerCase();
    return recordsWithStatus.filter((record) =>
      Object.values(record).some((val) => val?.toString().toLowerCase().includes(lower))
    );
  }, [recordsWithStatus, filter]);

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = filteredRecords[rowIndex]._id;
    if (id) updateRecord(id, { ...filteredRecords[rowIndex], [columnId]: value });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Invoice #", "SKU", "Description", "Quantity", "Amount", "Total Cost", "Arrival", "Expiration", "Days Left", "Remarks", "Status"]],
      body: filteredRecords.map((r) => [
        r.invoiceNumber, r.sku, r.description, r.quantity, r.amount, r.totalCost,
        formatDate(r.dateOfArrival), formatDate(r.expiration), r.daysLeft, r.remarks, r.status.toUpperCase(),
      ]),
    });
    doc.save("inventory_records.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map((r) => ({
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
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory_records.xlsx");
  };

  // Editable cell
  const EditableCell: React.FC<{ value: any; rowIndex: number; columnId: string }> = ({ value, rowIndex, columnId }) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (columnId === "dateOfArrival" || columnId === "expiration") {
        const [day, month, year] = newValue.split("/");
        if (day && month && year) {
          newValue = new Date(+year, +month - 1, +day).toISOString(); // save ISO internally
        }
      }
      updateCellRecord(rowIndex, columnId, newValue);
      setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
    };

    return isEditing ? (
      <input
        autoFocus
        type="text"
        defaultValue={(columnId === "dateOfArrival" || columnId === "expiration") && value ? formatDate(value) : value}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{ width: "100%", border: "1px solid #999", padding: "2px 4px", borderRadius: "4px" }}
      />
    ) : (
      <span style={{ cursor: "pointer" }} onClick={() => setEditingCell({ rowIndex, columnId })}>
        {(columnId === "dateOfArrival" || columnId === "expiration") && value ? formatDate(value) : value}
      </span>
    );
  };

  const columns: Column<any>[] = useMemo(() => [
    { Header: "Invoice #", accessor: "invoiceNumber", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "SKU", accessor: "sku", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "Description", accessor: "description", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "Quantity", accessor: "quantity", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "Amount", accessor: "amount", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "Total Cost", accessor: "totalCost", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "Arrival", accessor: "dateOfArrival", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    { Header: "Expiration", accessor: "expiration", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    {
      Header: "Days Left",
      accessor: "daysLeft",
      Cell: ({ value }) => <span style={{ color: typeof value === "number" ? (value <= 0 ? "red" : value <= 10 ? "orange" : "green") : "black" }}>{typeof value === "number" ? (value <= 0 ? "Expired" : `${value} days`) : value}</span>
    },
    { Header: "Remarks", accessor: "remarks", Cell: ({ value, row, column }) => <EditableCell value={value} rowIndex={row.index} columnId={column.id} /> },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value, row }) => (
        <span
          style={{
            color: value === "expired" ? "red" : value === "expiring_soon" ? "orange" : "green",
            fontWeight: "bold",
            cursor: value === "expired" || value === "active" ? "pointer" : "default",
          }}
          onClick={() => {
            const status = row.original.status;
            if ((status === "expired" || status === "active") && row.original._id) {
              const confirmDelete = window.confirm(`This record (Invoice #${row.original.invoiceNumber}) is ${status}. Do you want to delete it?`);
              if (confirmDelete) deleteRecord(row.original._id);
            }
          }}
          onMouseEnter={(e) => {
            if (value === "expired" || value === "active") (e.currentTarget.style.textDecoration = "underline");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          {value.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
  ], [editingCell, deleteRecord]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: filteredRecords });

  return (
    <div className="table-card">
      <h2 className="table-title">📦 Inventory Records</h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="🔍 Search by any field..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", marginRight: "0.5rem" }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={exportToPDF} style={{ backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "0.85rem" }}>📄 PDF</button>
          <button onClick={exportToExcel} style={{ backgroundColor: "#5cb85c", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "0.85rem" }}>📊 Excel</button>
        </div>
      </div>

      <table {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()} key={hg.id}>
              {hg.headers.map(col => <th {...col.getHeaderProps()} key={col.id}>{col.render("Header")}</th>)}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            const status = row.original.status;
            const rowStyle = status === "expired" ? { backgroundColor: "#ffe6e6" } : status === "expiring_soon" ? { backgroundColor: "#fff5e6" } : {};
            return (
              <tr {...row.getRowProps()} key={row.id} style={rowStyle}>
                {row.cells.map(cell => <td {...cell.getCellProps()} key={cell.column.id}>{cell.render("Cell")}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
