// src/Planner/PeriodTrackerPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PeriodTrackerPage.css';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL;

const PeriodTrackerPage = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    flow: 'medium',
    symptoms: [],
  });

  const token = localStorage.getItem('token');

  const symptomsList = ['Cramping', 'Headache', 'Backache', 'Nausea'];

  /* =======================
     FETCH ENTRIES (SAFE)
     ======================= */
  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/period`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res?.data;
      const periodArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setEntries(periodArray);
      setError('');
    } catch (err) {
      console.error('Error fetching period entries:', err);
      setEntries([]);
      setError('Failed to load period data');
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  /* =======================
     FORM HANDLERS
     ======================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        symptoms: checked
          ? [...prev.symptoms, value]
          : prev.symptoms.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/period`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFormData({
        startDate: '',
        endDate: '',
        flow: 'medium',
        symptoms: [],
      });

      fetchEntries();
    } catch (err) {
      console.error('Error saving period entry:', err);
      setError('Failed to save entry');
    }
  };

  /* =======================
     PIE CHART (SAFE)
     ======================= */
  const getFlowChartData = () => {
    const flowCounts = { light: 0, medium: 0, heavy: 0 };

    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        if (entry?.flow && flowCounts[entry.flow] !== undefined) {
          flowCounts[entry.flow]++;
        }
      });
    }

    return {
      labels: ['Light', 'Medium', 'Heavy'],
      datasets: [
        {
          label: 'Flow Distribution',
          data: [
            flowCounts.light,
            flowCounts.medium,
            flowCounts.heavy,
          ],
          backgroundColor: [
            '#FFD6E8',
            '#FFB6C1',
            '#FF69B4',
          ],
          borderWidth: 1,
          borderColor: '#fff',
        },
      ],
    };
  };

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="period-tracker-container">
      <h2>Period Tracker</h2>

      <form onSubmit={handleSubmit} className="period-form">
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        <label>Flow</label>
        <select
          name="flow"
          value={formData.flow}
          onChange={handleChange}
        >
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>

        <div className="symptoms-section">
          <label>Symptoms</label>
          {symptomsList.map((symptom) => (
            <label key={symptom}>
              <input
                type="checkbox"
                value={symptom}
                checked={formData.symptoms.includes(symptom)}
                onChange={handleChange}
              />
              {symptom}
            </label>
          ))}
        </div>

        <button type="submit">Save Entry</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="flow-chart-section">
        <h3>Flow Overview</h3>
        {entries.length > 0 ? (
          <Pie data={getFlowChartData()} />
        ) : (
          <p>No data to visualize yet.</p>
        )}
      </div>

      <div className="period-entries">
        <h3>Logged Entries</h3>

        {entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <p><strong>Start:</strong> {new Date(entry.startDate).toLocaleDateString()}</p>
              <p><strong>End:</strong> {new Date(entry.endDate).toLocaleDateString()}</p>
              <p><strong>Flow:</strong> {entry.flow}</p>
              <p><strong>Symptoms:</strong> {entry.symptoms?.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PeriodTrackerPage;

