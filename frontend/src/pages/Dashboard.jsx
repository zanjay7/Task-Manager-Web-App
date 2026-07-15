import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import TaskFilter from '../components/TaskFilter';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completed_percentage: 0,
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = { page };
      if (filter !== 'all') {
        queryParams.status = filter;
      }
      if (search) {
        queryParams.search = search;
      }

      const response = await api.get('/tasks/', { params: queryParams });

      const taskList = response.data.results || response.data;
      setTasks(taskList);
      setHasNextPage(Boolean(response.data.next));
      setHasPreviousPage(Boolean(response.data.previous));
    } catch (err) {
      setError('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/tasks/stats/');
      setStats(response.data);
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, tasks]);

  const handleCreateOrUpdate = async (taskData) => {
    setError('');
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, taskData);
        setEditingTask(null);
      } else {
        await api.post('/tasks/', taskData);
      }
      fetchTasks();
    } catch (err) {
      setError('Could not save the task. Check the fields and try again.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.patch(`/tasks/${task.id}/`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Could not update the task.');
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}/`);
      fetchTasks();
    } catch (err) {
      setError('Could not delete the task.');
    }
  };

  return (
    <div className="dashboard">
      <ProgressBar
        percentage={stats.completed_percentage}
        completed={stats.completed}
        total={stats.total}
      />

      <TaskForm
        onSubmit={handleCreateOrUpdate}
        editingTask={editingTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      <TaskFilter
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="empty-state">Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p className="empty-state">No tasks here yet.</p>
      )}

      {!loading && tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleComplete}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {(hasNextPage || hasPreviousPage) && (
        <div className="pagination">
          <button
            className="btn btn-outline"
            disabled={!hasPreviousPage}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            className="btn btn-outline"
            disabled={!hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;