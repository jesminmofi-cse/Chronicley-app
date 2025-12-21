// src/Planner/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskPage.css';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL;

const TaskPage = () => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res?.data;
      const taskArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setTasks(taskArray);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        { title, dueDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle('');
      setDueDate('');
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const toggleCompletion = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="task-page">
      <h2>📝 Task Manager</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Enter your task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="empty">
            No tasks yet. Either you’re super productive or super chill 😎
          </p>
        ) : (
          tasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${task.isCompleted ? 'completed' : ''}`}
            >
              <span onClick={() => toggleCompletion(task._id)}>
                <FaCheckCircle
                  className={`icon ${task.isCompleted ? 'complete' : ''}`}
                />
              </span>

              <div className="task-content">
                <p className="title">{task.title}</p>
                {task.dueDate && (
                  <p className="due">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <FaTrash
                className="icon trash"
                onClick={() => deleteTask(task._id)}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskPage;
