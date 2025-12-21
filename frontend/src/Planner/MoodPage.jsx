// src/Planner/MoodTrackerPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MoodPage.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL;

const MoodTrackerPage = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [mood, setMood] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMoodLogs();
    // eslint-disable-next-line
  }, []);

  const fetchMoodLogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/moods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res?.data;
      const moodArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setMoodLogs(moodArray);
    } catch (err) {
      console.error('Failed to load mood data:', err);
      setMoodLogs([]);
      setError('Failed to load mood data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMood = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/moods`,
        { mood, date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMood('');
      setDate('');
      fetchMoodLogs();
    } catch (err) {
      console.error('Failed to add mood:', err);
      setError(err.response?.data?.message || 'Failed to add mood');
    }
  };

  const pastelColors = {
    happy: '#fce1e4',
    sad: '#cde2f2',
    angry: '#fdd9c5',
    neutral: '#e6e6e6',
    excited: '#d5f4e6',
    anxious: '#f5e1fd',
  };

  const buildChartData = () => {
    const moodCount = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0,
      excited: 0,
      anxious: 0,
    };

    moodLogs.forEach((log) => {
      if (log?.mood && moodCount[log.mood] !== undefined) {
        moodCount[log.mood]++;
      }
    });

    return {
      labels: Object.keys(moodCount),
      datasets: [
        {
          label: 'Mood Frequency',
          data: Object.values(moodCount),
          backgroundColor: Object.keys(moodCount).map(
            (m) => pastelColors[m]
          ),
          borderRadius: 10,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} entries`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Mood Count' },
      },
      x: {
        title: { display: true, text: 'Moods' },
      },
    },
  };

  return (
    <div className="mood-tracker-page">
      <h2>Mood Tracker</h2>

      <form className="mood-form" onSubmit={handleAddMood}>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
        >
          <option value="">-- Choose Mood --</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="neutral">Neutral</option>
          <option value="excited">Excited</option>
          <option value="anxious">Anxious</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">Add Mood</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="no-data">Loading mood data… 🌦️</p>
      ) : moodLogs.length === 0 ? (
        <p className="no-data">
          No mood data yet. How are you feeling today? 🌈
        </p>
      ) : (
        <div className="mood-chart">
          <Bar data={buildChartData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default MoodTrackerPage;
