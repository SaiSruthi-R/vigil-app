const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- MYSQL CONNECTION ----------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vigil",
});

db.connect((err) => {
  if (err) console.log("DB error:", err);
  else console.log("MySQL Connected");
});

// ---------------- RISK ENGINE ----------------
app.post("/analyze", (req, res) => {
  // 🔥 FORCE NUMBER CONVERSION (CRITICAL FIX)
  const work = Number(req.body.work || 0);
  const sleep = Number(req.body.sleep || 0);
  const meetings = Number(req.body.meetings || 0);
  const caffeine = Number(req.body.caffeine || 0);
  const screen = Number(req.body.screen || 0);
  const tremor = Number(req.body.tremor || 0);

  let risk =
    work * 2 +
    meetings * 3 +
    caffeine * 2 -
    sleep * 3 +
    screen * 1.2 +
    tremor * 2.5;

  risk = Math.max(0, Math.min(100, risk));

  // ---------------- SAVE TO MYSQL ----------------
  db.query(
    "INSERT INTO risk_logs (work, sleep, meetings, caffeine, screen, tremor, risk) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [work, sleep, meetings, caffeine, screen, tremor, risk]
  );

  // ---------------- EXPLANATION ENGINE ----------------
  let explanation = [];

  if (sleep < 5) explanation.push("Low sleep is the strongest factor");
  if (work > 8) explanation.push("High workload detected");
  if (meetings > 4) explanation.push("Context switching overload");
  if (caffeine > 3) explanation.push("Caffeine masking fatigue");
  if (tremor > 40) explanation.push("Physiological stress detected");

  // 🔥 IMPORTANT FALLBACK
  if (explanation.length === 0) {
    explanation.push("System stable - no major burnout signals");
  }

  res.json({
    risk,
    explanation,
  });
});

// ---------------- START SERVER ----------------
app.listen(3000, () => {
  console.log("Server running on port 3000");
});