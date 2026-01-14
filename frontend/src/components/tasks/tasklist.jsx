import "./tasklist.css";

const TaskList = ({ tasks, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="empty">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task.id}>
          <div className="task-header">
            <h4>{task.title}</h4>
            <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>

          <p className="description">
            {task.description || "No description"}
          </p>

          <div className="task-footer">
            <span className={`status ${task.status.replace(" ", "").toLowerCase()}`}>
              {task.status}
            </span>

            <button
              className="delete-btn"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
