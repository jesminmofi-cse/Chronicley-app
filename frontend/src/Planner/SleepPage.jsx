// src/Planner/SleepPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SleepPage.css';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SleepPage = () => {
  const [sleepEntries, setSleepEntries] = useState([]);
  const [sleepStart, setSleepStart] = useState('');
  const [sleepEnd, setSleepEnd] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSleepData();
  }, []);

  const fetchSleepData = async () => {
    try {
      const res = await axios.get('/api/sleep', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSleepEntries(res.data.slice(0, 7).reverse());
    } catch (err) {
      console.error(err);
      setError('Failed to load sleep data');
    }
  };

  const handleAddSleep = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/sleep',
        { sleepStart, sleepEnd },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSleepStart('');
      setSleepEnd('');
      fetchSleepData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add sleep entry');
    }
  };

  const data = {
    labels: sleepEntries.map(entry =>
      new Date(entry.sleepStart).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Sleep Duration (hrs)',
        data: sleepEntries.map(entry => entry.duration),
        backgroundColor: 'rgba(128, 128, 128, 0.4)',
        borderColor: '#888',
        pointBackgroundColor: '#ccc',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 12,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="sleep-page">
      <h2>Sleep Tracker</h2>

      <form className="sleep-form" onSubmit={handleAddSleep}>
        <div className="input-group">
          <label>Sleep Start</label>
          <input
            type="datetime-local"
            value={sleepStart}
            onChange={(e) => setSleepStart(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Sleep End</label>
          <input
            type="datetime-local"
            value={sleepEnd}
            onChange={(e) => setSleepEnd(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Entry</button>
      </form>

      {error && <p className="error">{error}</p>}

      {sleepEntries.length === 0 ? (
        <p className="no-data">No sleep data yet. Start logging to track your rest! 😴</p>
      ) : (
        <div className="sleep-chart">
          <Radar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default SleepPage;
