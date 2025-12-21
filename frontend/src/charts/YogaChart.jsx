// frontend/src/charts/YogaChart.jsx
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

const YogaChart = () => {
  const [yogaLogs, setYogaLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYogaData = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('/api/yoga', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // 🛡️ ABSOLUTE SAFE EXTRACTION
        const raw = res?.data;
        const yogaArray =
          Array.isArray(raw?.data) ? raw.data :
          Array.isArray(raw) ? raw :
          [];

        setYogaLogs(yogaArray);
      } catch (err) {
        console.error('Error fetching yoga data:', err);
        setYogaLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYogaData();
  }, []);

  // 🛡️ SAFE DAY AGGREGATION
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
    for (let i = 0; i < yogaLogs.length; i++) {
      const log = yogaLogs[i];
      if (!log?.date || typeof log.duration !== 'number') continue;

      const day = new Date(log.date).toLocaleDateString('en-US', {
        weekday: 'long',
      });

      if (dayMap[day] !== undefined) {
        dayMap[day] += log.duration;
      }
    }
  }

  const chartData = {
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
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
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
    <div>
      <h4>Yoga Tracker</h4>

      {loading ? (
        <p>Loading yoga data… 🧘‍♀️</p>
      ) : yogaLogs.length === 0 ? (
        <p>No yoga data yet</p>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default YogaChart;
