// src/Planner/JournalPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JounalPage.css';

const API_URL = process.env.REACT_APP_API_URL;

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchEntries = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/journal`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res?.data;
      const journalArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setEntries(journalArray);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setEntries([]);
      setError('Failed to load journal entries');
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim() || !date) {
      setError('Date and content are required');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/journal`,
        { content, date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContent('');
      setDate('');
      fetchEntries();
    } catch (err) {
      console.error('Error saving entry:', err);
      setError(err.response?.data?.message || 'Failed to save entry');
    }
  };

  return (
    <div className="journal-container">
      <h2 className="journal-title">🧡 Dear Diary</h2>

      <form className="journal-form" onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Your thoughts:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          placeholder="Write your heart out..."
        />

        <button type="submit">Save Entry</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="journal-entries">
        <h3>Previous Entries</h3>

        {entries.length === 0 ? (
          <p className="empty">No entries yet. Start writing today ✨</p>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <div className="entry-date">
                {entry.date
                  ? new Date(entry.date).toLocaleDateString()
                  : 'Unknown date'}
              </div>
              <p>{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalPage;
