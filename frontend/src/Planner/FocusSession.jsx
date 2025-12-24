import { useEffect, useState } from "react";

function FocusSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(""); 
  const [shapeSize, setShapeSize] = useState(100); 
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const startSession = () => {
    if (!duration || duration <= 0) return;
    setIsSessionActive(true);
    setIsPaused(false);
    setShapeSize(100);
    setShowSuccessPopup(false);
  };

  const pauseSession = () => setIsPaused(true);
  const resumeSession = () => setIsPaused(false);

  const stopSession = () => {
    setIsSessionActive(false);
    setIsPaused(false);
    setShowSuccessPopup(true);
  };

  useEffect(() => {
    if (!isSessionActive || isPaused) return;

    const totalSeconds = duration * 60;
    const shrinkRate = 100 / totalSeconds;

    const interval = setInterval(() => {
      setShapeSize((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setIsSessionActive(false);
          setShowSuccessPopup(true);
          return 0;
        }
        return prev - shrinkRate;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isPaused, duration]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#96eea3ff",
        color: "#16e782ff",
        flexDirection: "column",
        gap: "20px"
      }}
    >
      <h2>Focus Session</h2>

      {!isSessionActive && (
        <>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "200px",
            }}
          />

          <button onClick={startSession}>Start Session</button>
        </>
      )}

      {isSessionActive && (
        <>
          <div
            style={{
              width: `${shapeSize * 3}px`,
              height: `${shapeSize * 3}px`,
              borderRadius: "50%",
              background: "#45e4aaff",
              transition: "width 1s linear, height 1s linear",
            }}
          />
          <p>{isPaused ? "⏸ Paused" : " Do Not Disturb"}</p>

          <div style={{ display: "flex", gap: "10px" }}>
            {!isPaused && <button onClick={pauseSession}>Pause</button>}
            {isPaused && <button onClick={resumeSession}>Resume</button>}
            <button onClick={stopSession}>Stop</button>
          </div>
        </>
      )}

      {showSuccessPopup && (
        <div
          style={{
            background: "#22c55e",
            color: "#9ff395ff",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>Session Complete</h3>
          <p>You showed up. That counts.</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
export default FocusSession;