// src/Planner/YogaPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './YogaPage.css';
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

const YogaPage = () => {
  const [yogaLogs, setYogaLogs] = useState([]);
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchYogaData();
    // eslint-disable-next-line
  }, []);

  const fetchYogaData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/yoga`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res?.data;
      const yogaArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setYogaLogs(yogaArray);
    } catch (err) {
      console.error('Failed to load yoga data:', err);
      setYogaLogs([]);
      setError('Failed to load yoga data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddYoga = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/yoga`,
        {
          type: sessionType,
          duration: Number(duration),
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessionType('');
      setDuration('');
      setDate('');
      fetchYogaData();
    } catch (err) {
      console.error('Failed to add yoga session:', err);
      setError(err.response?.data?.message || 'Failed to add yoga session');
    }
  };

  const buildChartData = () => {
    const dayMap = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    yogaLogs.forEach((log) => {
      if (!log?.date || typeof log.duration !== 'number') return;
      const day = new Date(log.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayMap[day] += log.duration;
    });

    return {
      labels: Object.keys(dayMap),
      datasets: [
        {
          label: 'Yoga Minutes per Day',
          data: Object.values(dayMap),
          backgroundColor: [
            '#f5f5dc',
            '#ede3c3',
            '#e5d8c0',
            '#d6c7af',
            '#c8b69f',
            '#baa58f',
            '#ac947f',
          ],
          borderRadius: 10,
        },
      ],
    };
  };

  return (
    <div className="yoga-page">
      <h2>Yoga Tracker</h2>

      <form className="yoga-form" onSubmit={handleAddYoga}>
        <input
          type="text"
          placeholder="Session Type"
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add Session</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading yoga data… 🧘‍♀️</p>
      ) : yogaLogs.length === 0 ? (
        <p>No yoga data yet 🌿</p>
      ) : (
        <div style={{ minHeight: 300 }}>
          <Bar data={buildChartData()} options={{ indexAxis: 'y', responsive: true }} />
        </div>
      )}
    </div>
  );
};

export default YogaPage;
