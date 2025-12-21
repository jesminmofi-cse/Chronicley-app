// src/components/Home/WaterChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const WaterChart = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('/api/water', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // 🛡️ SAFE ARRAY EXTRACTION (CRITICAL FIX)
        const waterArray = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setEntries(waterArray.slice(-7).reverse());
      } catch (err) {
        console.error('Error fetching water data:', err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const chartData = {
    labels: entries.map((entry) =>
      entry.date || entry.createdAt
        ? new Date(entry.date || entry.createdAt).toLocaleDateString()
        : 'Unknown'
    ),
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: entries.map((entry) =>
          typeof entry.amount === 'number' ? entry.amount : 0
        ),
        borderColor: '#1E90FF',
        backgroundColor: 'rgba(135, 206, 250, 0.4)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00BFFF',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} ml`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Milliliters (ml)' },
      },
      x: {
        title: { display: true, text: 'Date' },
      },
    },
  };

  return (
    <div>
      <h4>Water Intake</h4>

      {loading ? (
        <p>Loading water data… 💧</p>
      ) : entries.length === 0 ? (
        <p>No water data yet</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default WaterChart;
