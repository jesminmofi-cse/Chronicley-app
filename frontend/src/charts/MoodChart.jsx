// src/components/Home/MoodChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const MoodChart = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMoodLogs = async () => {
      try {
        const res = await axios.get('/api/moods', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // 🛡️ SAFE ARRAY EXTRACTION (CRITICAL FIX)
        const moodArray = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setMoodLogs(moodArray);
      } catch (err) {
        console.error('Failed to fetch mood data:', err);
        setMoodLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodLogs();
  }, [token]);

  const pastelColors = {
    happy: '#fce1e4',
    sad: '#cde2f2',
    angry: '#fdd9c5',
    neutral: '#e6e6e6',
    excited: '#d5f4e6',
    anxious: '#f5e1fd',
  };

  // 🛡️ SAFE CHART DATA (NO ASSUMPTIONS)
  const chartData = () => {
    const moodCount = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0,
      excited: 0,
      anxious: 0,
    };

    if (Array.isArray(moodLogs)) {
      moodLogs.forEach((log) => {
        if (log?.mood && moodCount[log.mood] !== undefined) {
          moodCount[log.mood]++;
        }
      });
    }

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
    <div>
      <h4>Mood Tracker</h4>

      {loading ? (
        <p>Loading mood data… 🌈</p>
      ) : moodLogs.length === 0 ? (
        <p>No mood data available</p>
      ) : (
        <Bar data={chartData()} options={chartOptions} />
      )}
    </div>
  );
};

export default MoodChart;
