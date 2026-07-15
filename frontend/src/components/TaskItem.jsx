import React from 'react';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  let cardClassName = 'task-item';
  if (task.completed) {
    cardClassName = 'task-item completed';
  }

  let priorityColor = '#ff9800';
  if (task.priority === 'low') {
    priorityColor = '#4caf50';
  } else if (task.priority === 'high') {
    priorityColor = '#f44336';
  }

  return (
    <div className={cardClassName}>
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
      </label>

      <div className="task-content">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <span className="task-priority" style={{ backgroundColor: priorityColor }}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {task.due_date && (
          <span className="task-due">Due: {task.due_date}</span>
        )}
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
          ✏️
        </button>
        <button className="icon-btn" onClick={() => onDelete(task.id)} title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;