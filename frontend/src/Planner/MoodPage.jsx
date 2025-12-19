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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MoodTrackerPage = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [mood, setMood] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const fetchMoodLogs = async () => {
    try {
      const res = await axios.get('/api/moods', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMoodLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load mood data');
    }
  };

  const handleAddMood = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/moods',
        { mood, date },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setMood('');
      setDate('');
      fetchMoodLogs();
    } catch (err) {
      console.error(' Failed', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Failed to add mood');
    }
  };

  // Pastel shades for emotions
  const pastelColors = {
    happy: '#fce1e4',
    sad: '#cde2f2',
    angry: '#fdd9c5',
    neutral: '#e6e6e6',
    excited: '#d5f4e6',
    anxious: '#f5e1fd',
  };

  const chartData = () => {
    const moodCount = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0,
      excited: 0,
      anxious: 0,
    };

    moodLogs.forEach((log) => {
      if (moodCount[log.mood] !== undefined) {
        moodCount[log.mood]++;
      }
    });

    const labels = Object.keys(moodCount);
    const data = Object.values(moodCount);
    const backgroundColors = labels.map((m) => pastelColors[m]);

    return {
      labels,
      datasets: [
        {
          label: 'Mood Frequency',
          data,
          backgroundColor: backgroundColors,
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
        <div className="input-group">
          <label>Select Mood</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)} required>
            <option value="">-- Choose --</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="neutral">Neutral</option>
            <option value="excited">Excited</option>
            <option value="anxious">Anxious</option>
          </select>
        </div>
        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Mood</button>
      </form>

      {error && <p className="error">{error}</p>}

      {moodLogs.length === 0 ? (
        <p className="no-data">No mood data yet. How are you feeling today? 🌦️</p>
      ) : (
        <div className="mood-chart">
          <Bar data={chartData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};
export default MoodTrackerPage;