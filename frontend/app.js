const form = document.getElementById("incidentForm");
const list = document.getElementById("incidentList");
const debug = document.getElementById("debug");
const totalCount = document.getElementById("totalCount");
const priorityCount = document.getElementById("priorityCount");
const lastRefresh = document.getElementById("lastRefresh");

const severityRank = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3
};

function writeDebug(title, payload) {
  const details =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  debug.innerText = `${title}\n${details}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    title: document.getElementById("title").value.trim(),
    severity: document.getElementById("severity").value
  };

  writeDebug("Sending request...", data);

  try {
    const response = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Request failed");
    }

    writeDebug("Response received", result);
    await loadIncidents();
    form.reset();
  } catch (error) {
    writeDebug("Request failed", error.message);
  }
});

async function loadIncidents() {
  try {
    const response = await fetch("/api/incidents");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch incidents");
    }

    list.innerHTML = "";

    totalCount.innerText = data.length.toString();
    priorityCount.innerText = data
      .filter((incident) => severityRank[incident.severity] >= severityRank.high)
      .length.toString();
    lastRefresh.innerText = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    data.forEach((incident) => {
      const li = document.createElement("li");
      const severity = (incident.severity || "unknown").toLowerCase();
      const createdAt = incident.created_at
        ? new Date(incident.created_at).toLocaleString()
        : "Just now";

      const row = document.createElement("div");
      row.className = "incident-row";

      const meta = document.createElement("div");
      const title = document.createElement("strong");
      const time = document.createElement("p");
      const badge = document.createElement("span");

      title.innerText = incident.title;
      time.innerText = createdAt;
      badge.className = `severity-pill severity-${severity}`;
      badge.innerText = severity;

      meta.appendChild(title);
      meta.appendChild(time);
      row.appendChild(meta);
      row.appendChild(badge);
      li.appendChild(row);

      list.appendChild(li);
    });
  } catch (error) {
    writeDebug("Failed to load incidents", error.message);
  }
}

loadIncidents();
