import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkSchedule.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
const DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const SHIFTS = ["opening", "mid", "closing", "graveyard"];

interface User {
  _id?: string;
  name: string;
  userId: string;
  preferences?: Record<DayKey, string>;
  restDay?: DayKey;
}

interface Schedule {
  _id?: string;
  userId: string;
  name: string;
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export default function WorkSchedulePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [selectedRestDay, setSelectedRestDay] = useState<DayKey | "">("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${API_BASE_URL}/user/getAll`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get<Schedule[]>(
        `${API_BASE_URL}/work-schedule/getAll`
      );
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSchedules();
  }, []);

  const addUser = async () => {
    if (!name || !userId) return alert("Enter name and userId");
    try {
      await axios.post(`${API_BASE_URL}/user/create`, { name, userId });
      setName("");
      setUserId("");
      await fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to add user");
    }
  };

  const openPreferenceEditor = (u: User) => {
    setEditingUser(u);
    setSelectedShift(u.preferences?.mon || "");
    setSelectedRestDay(u.restDay || "");
  };

  const savePreferences = async () => {
    if (!editingUser) return;
    const newPrefs: Record<DayKey, string> = DAYS.reduce(
      (acc, d) => ({ ...acc, [d]: selectedShift }),
      {} as Record<DayKey, string>
    );

    try {
      await axios.put(`${API_BASE_URL}/user/preferences/${editingUser._id}`, {
        preferences: newPrefs,
        restDay: selectedRestDay,
      });
      setEditingUser(null);
      fetchUsers();
      alert("Preferences saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences");
    }
  };

  const generateSchedule = async () => {
    try {
      await axios.post(`${API_BASE_URL}/work-schedule/generate`);
      await fetchSchedules();
      alert("Schedule generated");
    } catch (err) {
      console.error(err);
      alert("Failed to generate schedule");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <section>
        <h2>Add User</h2>
        <input
          placeholder="userId (unique)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </section>

      <section>
        <h2>Users</h2>
        <ul>
          {users.map((u) => (
            <li key={u._id}>
              <strong>{u.name}</strong> ({u.userId}){" "}
              <button onClick={() => openPreferenceEditor(u)}>
                Set Preference
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Generate</h2>
        <button onClick={generateSchedule}>Generate Schedule</button>
        <button
          className="clear-btn"
          onClick={() =>
            axios
              .delete(`${API_BASE_URL}/work-schedule/clearAll`)
              .then(fetchSchedules)
          }
          style={{ marginLeft: 8 }}
        >
          Clear All
        </button>
      </section>

      <section>
        <h2>Schedules</h2>
        <table border={1}>
          <thead>
            <tr>
              <th>Name</th>
              {DAYS.map((d) => (
                <th key={d}>{d.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                {DAYS.map((d) => (
                  <td key={d}>{s[d]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Set Preference for {editingUser.name}</h3>

            <label>Preferred Shift:</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="">No preference</option>
              {SHIFTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <label>Preferred Rest Day:</label>
            <select
              value={selectedRestDay}
              onChange={(e) => setSelectedRestDay(e.target.value as DayKey)}
            >
              <option value="">No preference</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d.toUpperCase()}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={savePreferences}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
