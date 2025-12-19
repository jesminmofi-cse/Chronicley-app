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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const WaterPage = () => {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get('/api/water', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setEntries(data.reverse());
    } catch (err) {
      console.error('💦 Error fetching water entries:', err.message);
      setEntries([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount in ml');
      return;
    }

    const entryDate = date || new Date().toISOString(); // default to now

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
      setError('');
      fetchEntries();
    } catch (err) {
      console.error('🚱 Failed to add entry:', err.message);
      setError('Failed to log water intake');
    }
  };

  const chartData = {
    labels: entries.map((entry) =>
      new Date(entry.date || entry.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: entries.map((entry) => entry.amount),
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
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>

      {error && <p className="error">{error}</p>}

      {entries.length === 0 ? (
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
