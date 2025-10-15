import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useTable } from "react-table";
import "./WorkSchedule.css";
const EditableCell = ({ value: initialValue, row, column, updateSchedule, editable, }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
        setIsEditing(false);
        updateSchedule(row.index, column.id, value);
    };
    return (_jsx("div", { onClick: () => editable && setIsEditing(true), style: { cursor: editable ? "pointer" : "default" }, children: isEditing ? (_jsx("input", { value: value, onChange: (e) => setValue(e.target.value), autoFocus: true, onBlur: onBlur, className: "editable-input" })) : (value) }));
};
export default function WorkSchedule() {
    const [schedule, setSchedule] = useState([
        { name: "Mafe", mon: "opening", tue: "mid", wed: "closing", thu: "rd", fri: "opening", sat: "closing", sun: "gy" },
        { name: "Edison", mon: "gy", tue: "gy", wed: "rd", thu: "gy", fri: "closing", sat: "gy", sun: "gy" },
        { name: "Joe", mon: "closing", tue: "opening", wed: "opening", thu: "closing", fri: "rd", sat: "opening", sun: "closing" },
        { name: "Ricky", mon: "opening", tue: "closing", wed: "rd", thu: "opening", fri: "closing", sat: "opening", sun: "mid" },
        { name: "Shenna", mon: "closing", tue: "closing", wed: "opening", thu: "mid", fri: "opening", sat: "closing", sun: "rd" },
        { name: "Aaron", mon: "rd", tue: "opening", wed: "mid", thu: "closing", fri: "opening", sat: "opening", sun: "closing" },
        { name: "Lhen", mon: "gy", tue: "gy", wed: "gy", thu: "offset", fri: "rd", sat: "gy", sun: "gy" },
        { name: "Harve", mon: "opening", tue: "rd", wed: "opening", thu: "closing", fri: "opening", sat: "opening", sun: "opening" },
    ]);
    const updateSchedule = (rowIndex, columnId, value) => {
        setSchedule((old) => old.map((row, index) => {
            if (index === rowIndex) {
                return { ...old[rowIndex], [columnId]: value };
            }
            return row;
        }));
    };
    const deleteRow = (index) => {
        setSchedule((prev) => prev.filter((_, i) => i !== index));
    };
    const columns = useMemo(() => [
        {
            Header: "Name",
            accessor: "name",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Mon",
            accessor: "mon",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Tue",
            accessor: "tue",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Wed",
            accessor: "wed",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Thu",
            accessor: "thu",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Fri",
            accessor: "fri",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Sat",
            accessor: "sat",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Sun",
            accessor: "sun",
            Cell: (props) => (_jsx(EditableCell, { ...props, updateSchedule: updateSchedule, editable: true })),
        },
        {
            Header: "Delete",
            id: "delete",
            Cell: ({ row }) => (_jsx("button", { onClick: () => deleteRow(row.index), className: "button button-danger", children: "Delete" })),
        },
    ], [schedule]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: schedule });
    return (_jsxs("div", { className: "table-card", children: [_jsx("h2", { className: "table-title", children: "\uD83D\uDDD3 Work Schedule" }), _jsxs("table", { ...getTableProps(), className: "styled-table", children: [_jsx("thead", { children: headerGroups.map((hg) => (_jsx("tr", { ...hg.getHeaderGroupProps(), children: hg.headers.map((column) => (_jsx("th", { ...column.getHeaderProps(), children: column.render("Header") }))) }))) }), _jsx("tbody", { ...getTableBodyProps(), children: rows.map((row) => {
                            prepareRow(row);
                            return (_jsx("tr", { ...row.getRowProps(), children: row.cells.map((cell) => (_jsx("td", { ...cell.getCellProps(), children: cell.render("Cell") }))) }));
                        }) })] })] }));
}
