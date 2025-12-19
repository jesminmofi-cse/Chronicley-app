// YogaChart.jsx
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const YogaChart = () => {
  const [yogaLogs, setYogaLogs] = useState([]);

  useEffect(() => {
    const fetchYogaData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/yoga', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setYogaLogs(res.data);
      } catch (err) {
        console.error('Error fetching yoga data', err);
      }
    };
    fetchYogaData();
  }, []);

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

  const chartData = {
    labels: Object.keys(dayMap),
    datasets: [
      {
        label: 'Yoga Minutes per Day',
        data: Object.values(dayMap),
        backgroundColor: [
          '#f5f5dc', // Sunday
          '#ede3c3', // Monday
          '#e5d8c0', // Tuesday
          '#d6c7af', // Wednesday
          '#c8b69f', // Thursday
          '#baa58f', // Friday
          '#ac947f', // Saturday
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
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
    <div>
      <h4>Yoga Tracker</h4>
      {yogaLogs.length > 0 ? <Bar data={chartData} options={chartOptions} /> : <p>Loading...</p>}
    </div>
  );
};

export default YogaChart;
