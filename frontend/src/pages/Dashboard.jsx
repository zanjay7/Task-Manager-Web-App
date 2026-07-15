import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import TaskFilter from '../components/TaskFilter';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completed_percentage: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;
      const { data } = await api.get('/tasks/', { params });
      setTasks(data.results ?? data);
      setHasNext(Boolean(data.next));
      setHasPrev(Boolean(data.previous));
    } catch (err) {
      setError('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats/');
      setStats(data);
    } catch (err) {
      // non-critical, ignore silently
    }
  }, []);

  useEffect(() => { setPage(1); }, [filter, search]);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); }, [fetchStats, tasks]);

  const handleCreateOrUpdate = async (payload) => {
    setError('');
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, payload);
        setEditingTask(null);
      } else {
        await api.post('/tasks/', payload);
      }
      fetchTasks();
    } catch (err) {
      setError('Could not save the task. Check the fields and try again.');
    }
  };

  const handleToggle = async (task) => {
    try {
      await api.patch(`/tasks/${task.id}/`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Could not update the task.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}/`);
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

      <TaskFilter filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <p className="empty-state">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No tasks here yet.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {(hasNext || hasPrev) && (
        <div className="pagination">
          <button className="btn btn-outline" disabled={!hasPrev} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button className="btn btn-outline" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
