// src/Planner/GratitudePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GratitudePage.css';

const API_URL = process.env.REACT_APP_API_URL;

const GratitudePage = () => {
  const [formData, setFormData] = useState({
    date: '',
    grateful: ['', '', ''],
    intentions: ['', '', ''],
    goals: ['', '', ''],
    manifest: ['', '', ''],
    quote: '',
  });

  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (section, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await axios.post(
        `${API_URL}/api/gratitude`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFormData({
        date: '',
        grateful: ['', '', ''],
        intentions: ['', '', ''],
        goals: ['', '', ''],
        manifest: ['', '', ''],
        quote: '',
      });

      fetchEntries();
    } catch (error) {
      console.error('Error saving gratitude:', error);
      setError('Failed to save gratitude entry');
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/gratitude`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = response?.data;
      const entryArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setEntries(entryArray);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="gratitude-container">
      <h2>Daily Gratitude</h2>

      <p className="affirmation">
        “I am aligned with the calm energy of growth and gratitude.”
      </p>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        className="date-input"
      />

      {['grateful', 'intentions', 'goals', 'manifest'].map((section) => (
        <div className="section" key={section}>
          <h3>
            {section === 'grateful'
              ? 'I am grateful for:'
              : section === 'intentions'
              ? 'Intentions for the day:'
              : section === 'goals'
              ? 'Goals for the day:'
              : 'I manifest:'}
          </h3>

          {formData[section].map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) =>
                handleChange(section, index, e.target.value)
              }
            />
          ))}
        </div>
      ))}

      <div className="section">
        <h3>Quote of today:</h3>
        <input
          type="text"
          name="quote"
          value={formData.quote}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleSubmit} className="save-btn">
        Save Entry
      </button>

      {error && <p className="error">{error}</p>}

      <div className="entries">
        <h3>Previous Entries</h3>

        {entries.length === 0 ? (
          <p className="empty">No gratitude entries yet 🌱</p>
        ) : (
          entries.map((entry, index) => (
            <div key={index} className="entry">
              <p>
                <strong>Date:</strong>{' '}
                {entry.date
                  ? new Date(entry.date).toLocaleDateString()
                  : ''}
              </p>
              <p>
                <strong>Grateful:</strong>{' '}
                {entry.grateful?.join(', ')}
              </p>
              <p>
                <strong>Intentions:</strong>{' '}
                {entry.intentions?.join(', ')}
              </p>
              <p>
                <strong>Goals:</strong>{' '}
                {entry.goals?.join(', ')}
              </p>
              <p>
                <strong>Manifest:</strong>{' '}
                {entry.manifest?.join(', ')}
              </p>
              <p>
                <strong>Quote:</strong> {entry.quote}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GratitudePage;
