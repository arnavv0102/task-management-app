import { useState } from "react";
import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/authcontext";
import "./taskform.css";

const TaskForm = ({ onTaskAdded }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    duedate: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/tasks", "POST", form, token);
      console.log("api response",data);
      onTaskAdded(data);
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        duedate: "",
      });
    } catch {
      alert("Failed to create task");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create Task</h3>

      <input
        name="title"
        placeholder="Title"
        required
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <select name="priority" value={form.priority} onChange={handleChange}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <input
        type="date"
        name="duedate"
        value={form.duedate}
        onChange={handleChange}
        required
      />

      <button>Create</button>
    </form>
  );
};

export default TaskForm;
