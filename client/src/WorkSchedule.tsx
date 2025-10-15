import { useMemo, useState } from "react";
import { useTable} from "react-table";
import type { Column, CellProps } from "react-table";
import "./WorkSchedule.css";

interface WorkScheduleRow {
  name: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

interface EditableCellProps extends CellProps<WorkScheduleRow> {
  updateSchedule: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateSchedule,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateSchedule(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          className="editable-input"
        />
      ) : (
        value
      )}
    </div>
  );
};

export default function WorkSchedule() {
  const [schedule, setSchedule] = useState<WorkScheduleRow[]>([
    { name: "Mafe", mon: "opening", tue: "mid", wed: "closing", thu: "rd", fri: "opening", sat: "closing", sun: "gy" },
    { name: "Edison", mon: "gy", tue: "gy", wed: "rd", thu: "gy", fri: "closing", sat: "gy", sun: "gy" },
    { name: "Joe", mon: "closing", tue: "opening", wed: "opening", thu: "closing", fri: "rd", sat: "opening", sun: "closing" },
    { name: "Ricky", mon: "opening", tue: "closing", wed: "rd", thu: "opening", fri: "closing", sat: "opening", sun: "mid" },
    { name: "Shenna", mon: "closing", tue: "closing", wed: "opening", thu: "mid", fri: "opening", sat: "closing", sun: "rd" },
    { name: "Aaron", mon: "rd", tue: "opening", wed: "mid", thu: "closing", fri: "opening", sat: "opening", sun: "closing" },
    { name: "Lhen", mon: "gy", tue: "gy", wed: "gy", thu: "offset", fri: "rd", sat: "gy", sun: "gy" },
    { name: "Harve", mon: "opening", tue: "rd", wed: "opening", thu: "closing", fri: "opening", sat: "opening", sun: "opening" },
  ]);

  const updateSchedule = (rowIndex: number, columnId: string, value: any) => {
    setSchedule((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return { ...old[rowIndex], [columnId]: value };
        }
        return row;
      })
    );
  };

  const deleteRow = (index: number) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const columns: Array<Column<WorkScheduleRow>> = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Mon",
        accessor: "mon",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Tue",
        accessor: "tue",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Wed",
        accessor: "wed",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Thu",
        accessor: "thu",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Fri",
        accessor: "fri",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Sat",
        accessor: "sat",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Sun",
        accessor: "sun",
        Cell: (props) => (
          <EditableCell {...props} updateSchedule={updateSchedule} editable={true} />
        ),
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRow(row.index)}
            className="button button-danger"
          >
            Delete
          </button>
        ),
      },
    ],
    [schedule]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: schedule });

  return (
    <div className="table-card">
      <h2 className="table-title">🗓 Work Schedule</h2>
      <table {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
