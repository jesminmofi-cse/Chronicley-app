// src/Planner/WaterPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WaterPage.css';
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

const WaterPage = () => {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/water', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // 🛡️ BULLETPROOF ARRAY EXTRACTION
      const waterArray = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setEntries(waterArray.slice().reverse());
    } catch (err) {
      console.error('💦 Error fetching water entries:', err);
      setEntries([]);
      setError('Failed to load water data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount in ml');
      return;
    }

    const entryDate = date || new Date().toISOString();

    try {
      await axios.post(
        '/api/water',
        { amount: Number(amount), date: entryDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setAmount('');
      setDate('');
      fetchEntries();
    } catch (err) {
      console.error('🚱 Failed to add entry:', err);
      setError('Failed to log water intake');
    }
  };

  // 🛡️ SAFE CHART DATA
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
        borderColor: '#00BFFF',
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
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
    <div className="water-page">
      <h2>💧 Water Tracker</h2>

      <form className="water-form" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount in ml"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="no-data">Loading water data… 💦</p>
      ) : entries.length === 0 ? (
        <p className="no-data">No entries yet — hydrate yourself! 💙</p>
      ) : (
        <div className="water-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default WaterPage;
