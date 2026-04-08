import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dashboardPath = path.join(rootDir, "data", "dashboard.json");

function coercePercent(value, fallback) {
  if (!value) return fallback;
  return String(value).includes("%") ? String(value) : `${value}%`;
}

function updateMetric(metrics, id, nextValue) {
  const metric = metrics.find((item) => item.id === id);
  if (!metric || nextValue === undefined || nextValue === "") return;
  metric.value = String(nextValue);
}

async function readDashboard() {
  const raw = await fs.readFile(dashboardPath, "utf8");
  return JSON.parse(raw);
}

async function maybeFetchRemoteJson() {
  const url = process.env.DASHBOARD_REMOTE_JSON_URL;
  if (!url) return null;

  const headers = {};
  if (process.env.DASHBOARD_REMOTE_JSON_TOKEN) {
    headers.Authorization = `Bearer ${process.env.DASHBOARD_REMOTE_JSON_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Remote JSON request failed with status ${response.status}`);
  }

  return response.json();
}

function applyRemotePatch(data, patch) {
  if (!patch || typeof patch !== "object") return data;

  if (patch.summary) data.summary = { ...data.summary, ...patch.summary };
  if (patch.weeklyFocus) data.weeklyFocus = { ...data.weeklyFocus, ...patch.weeklyFocus };
  if (Array.isArray(patch.kpis)) {
    patch.kpis.forEach((incoming) => {
      const current = data.kpis.find((item) => item.id === incoming.id);
      if (current) Object.assign(current, incoming);
    });
  }

  data.meta = {
    ...(data.meta || {}),
    remoteSourceApplied: true
  };

  return data;
}

async function main() {
  const data = await readDashboard();

  const remotePatch = await maybeFetchRemoteJson().catch((error) => {
    console.warn(`Remote patch skipped: ${error.message}`);
    return null;
  });

  applyRemotePatch(data, remotePatch);

  updateMetric(data.kpis, "sessions", process.env.DASHBOARD_SESSIONS);
  updateMetric(data.kpis, "trial_starts", process.env.DASHBOARD_TRIAL_STARTS);
  updateMetric(data.kpis, "activation", coercePercent(process.env.DASHBOARD_ACTIVATION, undefined));
  updateMetric(data.kpis, "trial_to_paid", coercePercent(process.env.DASHBOARD_TRIAL_TO_PAID, undefined));

  if (process.env.DASHBOARD_SPRINT) data.weeklyFocus.sprint = process.env.DASHBOARD_SPRINT;
  if (process.env.DASHBOARD_OBJECTIVE) data.weeklyFocus.objective = process.env.DASHBOARD_OBJECTIVE;
  if (process.env.DASHBOARD_WINS) data.weeklyFocus.wins = process.env.DASHBOARD_WINS;
  if (process.env.DASHBOARD_BLOCKERS) data.weeklyFocus.blockers = process.env.DASHBOARD_BLOCKERS;

  data.meta = {
    ...(data.meta || {}),
    updatedAt: new Date().toISOString(),
    updatedBy: "scripts/sync-data.mjs"
  };

  await fs.writeFile(dashboardPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated ${path.relative(rootDir, dashboardPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
