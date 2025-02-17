import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [minutes, setMinutes] = useState(30);
  const [isNight, setIsNight] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const targetMinutes = 120 * 60;
  
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("drivingLogs")) || [];
    setLogs(savedLogs);
  }, []);

  const addLog = () => {
    if (minutes <= 0) return;
    const newLogs = [...logs, { minutes: Number(minutes), isNight, id: Date.now() }];
    setLogs(newLogs);
    localStorage.setItem("drivingLogs", JSON.stringify(newLogs));
  };

  const totalMinutes = logs.reduce((sum, log) => sum + (log.minutes || 0), 0);
  const nightMinutes = logs.filter((log) => log.isNight).reduce((sum, log) => sum + (log.minutes || 0), 0);
  const dayMinutes = totalMinutes - nightMinutes;
  const progress = totalMinutes > 0 ? (totalMinutes / targetMinutes) * 100 : 0;

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f8ff", color: "#333" }}>
      <h1 style={{ color: "#4caf50" }}>Driving Hours Tracker</h1>
      <div style={{ width: 200, margin: "auto", padding: "10px", backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <CircularProgressbar value={progress} text={`${Math.round(progress)}%`} 
          styles={buildStyles({ pathColor: "#4caf50", textColor: "#4caf50" })} />
      </div>
      <div style={{  display: "inline-block" , padding: "15px 25px", backgroundColor: "#EDE5A6", borderRadius: "10px", fontSize: "26px", fontWeight: "bold", marginTop: "15px" }}>
        {((totalMinutes || 0) / 60).toFixed(1)} hours
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
        <div style={{ padding: "15px 25px", backgroundColor: "#d1e7dd", borderRadius: "10px", fontSize: "22px", fontWeight: "bold" }}>Day: {(dayMinutes / 60).toFixed(1)}h</div>
        <div style={{ padding: "15px 25px", backgroundColor: "#f8d7da", borderRadius: "10px", fontSize: "22px", fontWeight: "bold" }}>Night: {(nightMinutes / 60).toFixed(1)}h</div>
      </div>
      <input type="range" min="0" max="60" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} 
        style={{ width: "80%", margin: "20px 0" }} />
      <p>{minutes} minutes</p>
      <label style={{ fontSize: "16px" }}>
        <input type="checkbox" checked={isNight} onChange={() => setIsNight(!isNight)} /> Night Driving
      </label>
      <button onClick={addLog} style={{ padding: "10px 15px", marginLeft: "10px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Minutes</button>
      <button onClick={() => setShowHistory(!showHistory)} style={{ padding: "10px 15px", marginLeft: "10px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>Toggle History</button>
      {showHistory && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#333" }}>History</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {logs.map((log) => (
              <li key={log.id} style={{ padding: "10px", backgroundColor: "#e3f2fd", margin: "5px 0", borderRadius: "5px", fontSize: "18px" }}>
                {((log.minutes || 0) / 60).toFixed(1)}h - {log.isNight ? "Night" : "Day"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
