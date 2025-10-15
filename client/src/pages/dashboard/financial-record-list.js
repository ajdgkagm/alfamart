import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFinancialRecords } from "../../contexts/financial-record-context";
// eslint-disable-next-line
import { useTable } from "react-table";
import { useMemo, useState } from "react";
const EditableCell = ({ value: initialValue, row, column, updateRecord, editable, }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
        setIsEditing(false);
        updateRecord(row.index, column.id, value);
    };
    return (_jsx("div", { onClick: () => editable && setIsEditing(true), style: { cursor: editable ? "pointer" : "default" }, children: isEditing ? (_jsx("input", { value: value, onChange: (e) => setValue(e.target.value), autoFocus: true, onBlur: onBlur, className: "editable-input" })) : typeof value === "string" ? (value) : (value.toString()) }));
};
export const FinancialRecordList = () => {
    const { records, updateRecord, deleteRecord } = useFinancialRecords();
    const updateCellRecord = (rowIndex, columnId, value) => {
        const id = records[rowIndex]._id;
        updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
    };
    const columns = useMemo(() => [
        {
            Header: "Description",
            accessor: "description",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateRecord: updateCellRecord, editable: true })),
        },
        {
            Header: "Amount",
            accessor: "amount",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateRecord: updateCellRecord, editable: true })),
        },
        {
            Header: "Category",
            accessor: "category",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateRecord: updateCellRecord, editable: true })),
        },
        {
            Header: "Payment Method",
            accessor: "paymentMethod",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateRecord: updateCellRecord, editable: true })),
        },
        {
            Header: "Date",
            accessor: "date",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateRecord: updateCellRecord, editable: false })),
        },
        {
            Header: "Delete",
            id: "delete",
            Cell: ({ row }) => (_jsx("button", { onClick: () => deleteRecord(row.original._id ?? ""), className: "button button-danger", children: "Delete" })),
        },
    ], [records]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: records });
    return (_jsxs("div", { className: "table-card", children: [_jsx("h2", { className: "table-title", children: "\uD83D\uDCCA Financial Records" }), _jsxs("table", { ...getTableProps(), className: "styled-table", children: [_jsx("thead", { children: headerGroups.map((hg) => (_jsx("tr", { ...hg.getHeaderGroupProps(), children: hg.headers.map((column) => (_jsx("th", { ...column.getHeaderProps(), children: column.render("Header") }))) }))) }), _jsx("tbody", { ...getTableBodyProps(), children: rows.map((row) => {
                            prepareRow(row);
                            return (_jsx("tr", { ...row.getRowProps(), children: row.cells.map((cell) => (_jsx("td", { ...cell.getCellProps(), children: cell.render("Cell") }))) }));
                        }) })] })] }));
};
