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
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSleepData();
    // eslint-disable-next-line
  }, []);

  const fetchSleepData = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/sleep', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // 🛡️ BULLETPROOF DATA EXTRACTION
      const sleepArray = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      // last 7 entries, latest first
      setSleepEntries(sleepArray.slice(-7).reverse());
    } catch (err) {
      console.error('Error fetching sleep data:', err);
      setError('Failed to load sleep data');
      setSleepEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSleep = async (e) => {
    e.preventDefault();
    setError('');

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
      console.error('Error adding sleep entry:', err);
      setError(err.response?.data?.message || 'Failed to add sleep entry');
    }
  };

  // 🛡️ SAFE CHART DATA (no assumptions)
  const chartData = {
    labels: sleepEntries.map(entry =>
      entry.sleepStart
        ? new Date(entry.sleepStart).toLocaleDateString()
        : 'Unknown'
    ),
    datasets: [
      {
        label: 'Sleep Duration (hrs)',
        data: sleepEntries.map(entry =>
          typeof entry.duration === 'number' ? entry.duration : 0
        ),
        backgroundColor: 'rgba(128, 128, 128, 0.4)',
        borderColor: '#888',
        pointBackgroundColor: '#ccc',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
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

      {loading ? (
        <p className="no-data">Loading sleep data… 😴</p>
      ) : sleepEntries.length === 0 ? (
        <p className="no-data">
          No sleep data yet. Start logging to track your rest! 🌙
        </p>
      ) : (
        <div className="sleep-chart">
          <Radar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default SleepPage;
