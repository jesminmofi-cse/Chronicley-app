import React from 'react';
import Sidebar from './Sidebar';
import './HomePage.css';

import MoodChart from '../charts/MoodChart';
import SleepChart from '../charts/SleepChart';
import YogaChart from '../charts/YogaChart';
import WaterChart from '../charts/WaterChart';

const HomePage = () => {
  return (
    <div className="home-container">
      <Sidebar />

      <main className="main-content">
        <header className="dashboard-header">
          <h2 className="dashboard-title">Your Activity Dashboard 🌿</h2>
          <p className="dashboard-subtitle">
            Welcome to Chroniclely! Reflect, track, and celebrate your progress — one mindful day at a time.
          </p>
        </header>

        <section className="graph-section">
          <div className="chart-wrapper"><MoodChart /></div>
          <div className="chart-wrapper"><SleepChart /></div>
          <div className="chart-wrapper"><YogaChart /></div>
          <div className="chart-wrapper"><WaterChart /></div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
