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

      const res = await axios.get('/api/yoga', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // 🛡️ SAFE ARRAY NORMALIZATION (CRITICAL)
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
        '/api/yoga',
        {
          type: sessionType,
          duration: Number(duration),
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
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

  // 🧘‍♀️ SAFE GROUPING BY WEEKDAY
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

    if (Array.isArray(yogaLogs)) {
      yogaLogs.forEach((log) => {
        if (!log?.date || typeof log.duration !== 'number') return;

        const day = new Date(log.date).toLocaleDateString('en-US', {
          weekday: 'long',
        });

        if (dayMap[day] !== undefined) {
          dayMap[day] += log.duration;
        }
      });
    }

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

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} minutes`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Minutes' },
      },
      y: {
        title: { display: true, text: 'Day of the Week' },
      },
    },
  };

  return (
    <div className="yoga-page">
      <h2>Yoga Tracker</h2>

      <form className="yoga-form" onSubmit={handleAddYoga}>
        <div className="input-group">
          <label>Session Type</label>
          <input
            type="text"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Duration (mins)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
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

        <button type="submit">Add Session</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="no-data">Loading yoga data… 🧘‍♀️</p>
      ) : yogaLogs.length === 0 ? (
        <p className="no-data">
          No yoga data yet. Let’s start your stretch streak! 🌿
        </p>
      ) : (
        <div className="yoga-chart" style={{ minHeight: 300 }}>
          <Bar data={buildChartData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default YogaPage;
