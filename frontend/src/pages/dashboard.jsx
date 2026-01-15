import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/authcontext";

import TaskList from "../components/tasks/tasklist";
import TaskForm from "../components/tasks/taskform";

import "./dashboard.css";

const Dashboard = () => {
  const { token, logout, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔹 FILTER STATES
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  // 🔹 FETCH TASKS + STATS
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const taskData = await apiRequest("/tasks", "GET", null, token);
        const statData = await apiRequest("/tasks/stats", "GET", null, token);

        // ✅ SAFELY HANDLE BACKEND RESPONSE
        // Accept array or object with data/tasks field
        let tasksArray = [];
        if (Array.isArray(taskData)) {
          tasksArray = taskData;
        } else if (taskData?.data) {
          tasksArray = taskData.data;
        } else if (taskData?.tasks) {
          tasksArray = taskData.tasks;
        }

        console.log("Fetched tasks:", tasksArray); // DEBUG

        setTasks(tasksArray);
        setFilteredTasks(tasksArray);
        setStats(statData || {});
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // 🔹 FILTER + SEARCH LOGIC
  useEffect(() => {
    let tempTasks = tasks.filter(Boolean);

    if (statusFilter) {
      tempTasks = tempTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    if (priorityFilter) {
      tempTasks = tempTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }

    if (search) {
      tempTasks = tempTasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(search.toLowerCase()) ||
          task.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTasks(tempTasks);
  }, [statusFilter, priorityFilter, search, tasks]);

  // 🔹 ADD TASK HANDLER
  const handleTaskCreated = (newTask) => {
    if (!newTask) return;

    setTasks((prev) => [newTask, ...prev]);

    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      pending:
        newTask.status === "Pending"
          ? prev.pending + 1
          : prev.pending,
      inProgress:
        newTask.status === "In Progress"
          ? prev.inProgress + 1
          : prev.inProgress,
      completed:
        newTask.status === "Completed"
          ? prev.completed + 1
          : prev.completed,
    }));
  };

  // 🔹 DELETE TASK HANDLER
  const handleDeleteTask = async (taskId) => {
    try {
      await apiRequest(`/tasks/${taskId}`, "DELETE", null, token);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setFilteredTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <h2>Task Manager</h2>

        <div className="user-info">
          <span>👋 {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {/* STATS */}
      <section className="stats">
        <div className="stat-card">
          <h4>Total</h4>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card pending">
          <h4>Pending</h4>
          <p>{stats.pending}</p>
        </div>

        <div className="stat-card progress">
          <h4>In Progress</h4>
          <p>{stats.inProgress}</p>
        </div>

        <div className="stat-card completed">
          <h4>Completed</h4>
          <p>{stats.completed}</p>
        </div>
      </section>

      {/* CREATE TASK */}
      <section className="create-task">
        <h3>Create Task</h3>
        <TaskForm onTaskAdded={handleTaskCreated} />
      </section>

      {/* FILTERS + SEARCH */}
      <section className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </section>

      {/* TASK LIST */}
      <section className="tasks-section">
        <h3>Your Tasks</h3>

        {filteredTasks.length === 0 ? (
          <p className="empty">No tasks found.</p>
        ) : (
          <TaskList tasks={filteredTasks} onDelete={handleDeleteTask} />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
