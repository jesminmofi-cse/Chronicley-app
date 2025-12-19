// SleepChart.jsx
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
    Legend
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

    useEffect(() => {
        const fetchSleepData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/sleep', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setSleepEntries(res.data.slice(0, 7).reverse());
            } catch (err) {
                console.error('Error fetching sleep data', err);
            }
        };
        fetchSleepData();
    }, []);

    const data = {
        labels: sleepEntries.map(entry =>
            new Date(entry.sleepStart).toLocaleDateString()
        ),
        datasets: [
            {
                label: 'Sleep Duration (hrs)',
                data: sleepEntries.map(entry => entry.duration),
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
            {sleepEntries.length > 0 ? <Radar data={data} options={options} /> : <p>Loading...</p>}
        </div>
    );
};

export default SleepChart;
