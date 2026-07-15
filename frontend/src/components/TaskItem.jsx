import React from 'react';

const priorityColor = { low: '#4caf50', medium: '#ff9800', high: '#f44336' };

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
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
          <span
            className="task-priority"
            style={{ backgroundColor: priorityColor[task.priority] }}
          >
            {task.priority}
          </span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        {task.due_date && <span className="task-due">Due: {task.due_date}</span>}
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">✏️</button>
        <button className="icon-btn" onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
      </div>
    </div>
  );
};

export default TaskItem;
