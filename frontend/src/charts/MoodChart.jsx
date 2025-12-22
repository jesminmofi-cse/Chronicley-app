// frontend/src/charts/MoodChart.jsx
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
        const API_URL = process.env.REACT_APP_API_URL;

        const res = await axios.get(`${API_URL}/api/moods`, {
           headers: { Authorization: `Bearer ${token}` },
        });


        const raw = res?.data;
        const moodArray =
          Array.isArray(raw?.data) ? raw.data :
          Array.isArray(raw) ? raw :
          [];

        setMoodLogs(moodArray);
      } catch (err) {
        console.error('MoodChart fetch error:', err);
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

  const buildChartData = () => {
    const moodCount = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0,
      excited: 0,
      anxious: 0,
    };

    if (Array.isArray(moodLogs)) {
      for (let i = 0; i < moodLogs.length; i++) {
        const mood = moodLogs[i]?.mood;
        if (moodCount[mood] !== undefined) {
          moodCount[mood]++;
        }
      }
    }

    const labels = Object.keys(moodCount);

    return {
      labels,
      datasets: [
        {
          label: 'Mood Frequency',
          data: Object.values(moodCount),
          backgroundColor: labels.map(m => pastelColors[m]),
          borderRadius: 10,
        },
      ],
    };
  };

  return (
    <div>
      <h4>Mood Tracker</h4>

      {loading ? (
        <p>Loading mood data… 🌈</p>
      ) : moodLogs.length === 0 ? (
        <p>No mood data available</p>
      ) : (
        <Bar data={buildChartData()} />
      )}
    </div>
  );
};

export default MoodChart;
