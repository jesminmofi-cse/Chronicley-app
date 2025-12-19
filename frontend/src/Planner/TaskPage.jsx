// src/Planner/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskPage.css';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

const TaskPage = () => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch tasks:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Task title is required');
      return;
    }

    try {
      await axios.post(
        '/api/tasks',
        { title, dueDate },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setTitle('');
      setDueDate('');
      setError('');
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err.message);
      setError('Failed to create task');
    }
  };

  const toggleCompletion = async (id) => {
    try {
      await axios.put(`/api/tasks/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task:', err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error(' Error deleting task:', err.message);
    }
  };

  return (
    <div className="task-page">
      <h2> Task Manager</h2>
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
          <p className="empty">No tasks yet. You're either super productive or super procrastinating 😎</p>
        ) : (
          tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
              <span onClick={() => toggleCompletion(task._id)}>
                {task.isCompleted ? <FaCheckCircle className="icon complete" /> : <FaCheckCircle className="icon" />}
              </span>
              <div className="task-content">
                <p className="title">{task.title}</p>
                {task.dueDate && (
                  <p className="due">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                )}
              </div>
              <FaTrash className="icon trash" onClick={() => deleteTask(task._id)} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskPage;
