// src/Planner/SleepChart.jsx
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

const SleepChart = () => {
  const [sleepEntries, setSleepEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('/api/sleep', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // 🛡️ SAFE ARRAY EXTRACTION (THIS IS THE FIX)
        const sleepArray = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setSleepEntries(sleepArray.slice(-7).reverse());
      } catch (err) {
        console.error('Error fetching sleep data:', err);
        setSleepEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, []);

  const chartData = {
    labels: sleepEntries.map((entry) =>
      entry.sleepStart
        ? new Date(entry.sleepStart).toLocaleDateString()
        : 'Unknown'
    ),
    datasets: [
      {
        label: 'Sleep Duration (hrs)',
        data: sleepEntries.map((entry) =>
          typeof entry.duration === 'number' ? entry.duration : 0
        ),
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
