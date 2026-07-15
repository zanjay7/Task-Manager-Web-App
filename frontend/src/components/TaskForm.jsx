import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);

      if (editingTask.description) {
        setDescription(editingTask.description);
      } else {
        setDescription('');
      }

      setPriority(editingTask.priority);

      if (editingTask.due_date) {
        setDueDate(editingTask.due_date);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    let dueDateToSend = null;
    if (dueDate) {
      dueDateToSend = dueDate;
    }

    onSubmit({
      title: title,
      description: description,
      priority: priority,
      due_date: dueDateToSend,
    });

    if (!editingTask) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  let submitButtonText = 'Add Task';
  if (editingTask) {
    submitButtonText = 'Save Changes';
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <div className="task-form-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          {submitButtonText}
        </button>

        {editingTask && (
          <button type="button" className="btn btn-outline" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;