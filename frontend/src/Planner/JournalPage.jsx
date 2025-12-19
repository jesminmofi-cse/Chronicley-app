// src/Planner/JournalPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JounalPage.css';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const fetchEntries = async () => {
    try {
      const res = await axios.get('/api/journal', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }});
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching journal entries:', err.message);
    }};

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !date) return;

    try {
      await axios.post(
        '/api/journal',
        { content, date },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      setContent('');
      setDate('');
      fetchEntries();
    } catch (err) {
      console.error('Error saving entry:', err.message);
    }
  };
  return (
    <div className="journal-container">
      <h2 className="journal-title">🧡 Dear Diary</h2>
      <form className="journal-form" onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
        <label>Your thoughts:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="5"placeholder="Write your heart out..."></textarea>
        <button type="submit">Save Entry</button>
      </form>
      <div className="journal-entries">
        <h3>Previous Entries</h3>
        {entries.map((entry) => (
          <div key={entry._id} className="entry-card">
            <div className="entry-date">{new Date(entry.date).toLocaleDateString()}</div>
            <p>{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
