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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const YogaPage = () => {
  const [yogaLogs, setYogaLogs] = useState([]);
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchYogaData();
  }, []);

  const fetchYogaData = async () => {
    try {
      const res = await axios.get('/api/yoga', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setYogaLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load yoga data');
    }
  };

  const handleAddYoga = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/yoga',
        { type: sessionType, duration, date },
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
      console.error('❌ Failed', err.message);
      setError(err.response?.data?.message || 'Failed to add yoga session');
    }
  };

  // 🧘‍♀️ Group durations by weekday
  const chartData = () => {
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
      const day = new Date(log.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayMap[day] += log.duration;
    });

    const labels = Object.keys(dayMap);
    const data = Object.values(dayMap);

    const beigePalette = [
      '#f5f5dc', // Sunday
      '#ede3c3', // Monday
      '#e5d8c0', // Tuesday
      '#d6c7af', // Wednesday
      '#c8b69f', // Thursday
      '#baa58f', // Friday
      '#ac947f', // Saturday
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Yoga Minutes per Day',
          data,
          backgroundColor: beigePalette,
          borderRadius: 10,
        },
      ],
    };
  };

  const chartOptions = {
    indexAxis: 'y', // horizontal bar
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} minutes`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Day of the Week',
        },
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

      {yogaLogs.length === 0 ? (
        <p className="no-data">No yoga data yet. Let's start your stretch streak! 🧘‍♀️</p>
      ) : (
        <div className="yoga-chart">
          <Bar data={chartData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default YogaPage;
