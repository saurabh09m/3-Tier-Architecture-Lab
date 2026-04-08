const express = require("express");
const db = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedSeverities = new Set(["low", "medium", "high", "critical"]);

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.post("/api/incidents", async (req, res) => {
  const requestId = Math.random().toString(36).slice(2, 10);
  const title = String(req.body.title || "").trim();
  const severity = String(req.body.severity || "").trim().toLowerCase();

  console.log(`[${requestId}] Incoming`, { title, severity });

  if (!title || title.length > 120 || !allowedSeverities.has(severity)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (title.includes("<script>")) {
    console.log(`[${requestId}] Blocked suspicious payload`);
    return res.status(403).json({ error: "Blocked payload" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO incidents (title, severity) VALUES (?, ?)",
      [title, severity]
    );

    console.log(`[${requestId}] Stored incident ${result.insertId}`);
    res.status(201).json({
      status: "stored",
      requestId,
      incidentId: result.insertId
    });
  } catch (error) {
    console.error(`[${requestId}] Failed to store incident`, error.message);
    res.status(500).json({ error: "Database write failed" });
  }
});

app.get("/api/incidents", async (_req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, title, severity, created_at FROM incidents ORDER BY created_at DESC, id DESC LIMIT 50"
    );
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch incidents", error.message);
    res.status(500).json({ error: "Database read failed" });
  }
});

app.listen(port, () => {
  console.log(`Backend running on ${port}`);
});
