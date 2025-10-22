import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TodoTasks.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

interface Task {
  _id: string;
  userId: string;
  title: string;
  done: boolean;
  taskDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const TodoTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editDate, setEditDate] = useState("");
  const [searchDate, setSearchDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const userId = "user_123"; // Replace with actual logged-in user

  const fetchTasksByDate = async (date: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/getByDate/${userId}/${date}`
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks by date:", err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/add`, {
        userId,
        title: newTask,
        taskDate,
      });
      setNewTask("");
      if (taskDate === searchDate) setTasks((prev) => [res.data.task, ...prev]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleDone = async (id: string) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/toggle/${id}`);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.task : t))
      );
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/edit/${id}`, {
        title: editValue,
        taskDate: editDate,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.task : t))
      );
      setEditId(null);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const clearAllTasks = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/clearAll/${userId}`);
      setTasks([]);
    } catch (err) {
      console.error("Error clearing tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasksByDate(searchDate);
  }, [searchDate]);

  return (
    <div className="todo-container">
      <h2>🗓️ Todo Task Manager</h2>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filter-row">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={() => fetchTasksByDate(searchDate)}>
          Search by Date
        </button>
        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearAllTasks}>
            Clear All
          </button>
        )}
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.done ? "done" : "pending"}>
            {editId === task._id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)}>💾 Save</button>
              </>
            ) : (
              <>
                <div className="task-info">
                  <span>{task.title}</span>
                  <small>📅 {new Date(task.taskDate).toLocaleDateString()}</small>
                </div>
                <div className="actions">
                  <button onClick={() => toggleDone(task._id)}>
                    {task.done ? "✔️ Done" : "⚠️ Pending"}
                  </button>
                  <button
                    onClick={() => {
                      setEditId(task._id);
                      setEditValue(task.title);
                      setEditDate(task.taskDate.split("T")[0]);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteTask(task._id)}>🗑️ Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="empty">No tasks found for this date.</p>
      )}
    </div>
  );
};

export default TodoTasks;
