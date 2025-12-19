// src/Planner/MeditationPage.jsx
import React, { useState } from 'react';
import './MeditationPage.css';

const meditations = [
  {
    title: "Morning Clarity",
    type: "morning",
    duration: "10 min",
    videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU",
  },
  {
    title: "Anxiety Relief",
    type: "anxiety",
    duration: "15 min",
    videoUrl: "https://www.youtube.com/embed/O-6f5wQXSu8",
  },
  {
    title: "Deep Sleep",
    type: "sleep",
    duration: "20 min",
    videoUrl: "https://www.youtube.com/embed/1vx8iUvfyCY",
  },
];

const MeditationPage = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? meditations
    : meditations.filter((m) => m.type === filter);

  return (
    <div className="meditation-page">
      <h2>🧘‍♀️ Meditation Library</h2>

      <div className="filters">
        {["all", "morning", "anxiety", "sleep"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="meditation-grid">
        {filtered.map((med, idx) => (
          <div key={idx} className="meditation-card">
            <iframe
              width="100%"
              height="180"
              src={med.videoUrl}
              title={med.title}
              frameBorder="0"
              allowFullScreen
            />
            <h4>{med.title}</h4>
            <p>{med.duration} • {med.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeditationPage;
