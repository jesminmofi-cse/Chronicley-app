// src/charts/SleepChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL;

const SleepChart = () => {
  const [sleepEntries, setSleepEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSleepEntries([]);
          return;
        }

        const res = await axios.get(`${API_URL}/api/sleep`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 🛡️ BULLETPROOF ARRAY EXTRACTION
        const raw = res?.data;
        const sleepArray =
          Array.isArray(raw?.data) ? raw.data :
          Array.isArray(raw) ? raw :
          [];

        // keep only last 7 entries (latest first)
        setSleepEntries(sleepArray.slice(-7).reverse());
      } catch (err) {
        console.error('SleepChart fetch error:', err);
        setSleepEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, []);

  const chartData = {
    labels: sleepEntries.map((entry) => {
      if (!entry?.sleepStart) return 'Unknown';
      const d = new Date(entry.sleepStart);
      return isNaN(d.getTime())
        ? 'Invalid'
        : d.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Sleep Duration (hrs)',
        data: sleepEntries.map((entry) =>
          typeof entry?.duration === 'number' ? entry.duration : 0
        ),
        backgroundColor: 'rgba(150, 150, 150, 0.35)',
        borderColor: '#888',
        pointBackgroundColor: '#aaa',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 12,
        ticks: { stepSize: 1 },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h4>Sleep Tracker</h4>

      {loading ? (
        <p>Loading sleep data… 😴</p>
      ) : sleepEntries.length === 0 ? (
        <p>No sleep data yet</p>
      ) : (
        <Radar data={chartData} options={options} />
      )}
    </div>
  );
};

export default SleepChart;
