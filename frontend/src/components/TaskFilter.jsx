import React from 'react';

const TaskFilter = ({ filter, setFilter, search, setSearch }) => {
  return (
    <div className="task-filter">
      <div className="filter-tabs">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default TaskFilter;
