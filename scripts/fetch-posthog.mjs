import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "data", "sources", "posthog.json");

const host = process.env.POSTHOG_HOST || "https://us.i.posthog.com";
const projectId = process.env.POSTHOG_PROJECT_ID;
const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const trialEvent = process.env.POSTHOG_TRIAL_EVENT || "trial_started";
const activationEvent = process.env.POSTHOG_ACTIVATION_EVENT || "activation_completed";
const pageviewEvent = process.env.POSTHOG_PAGEVIEW_EVENT || "$pageview";
const lookbackDays = Number(process.env.POSTHOG_LOOKBACK_DAYS || 7);

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function queryPostHog(query) {
  const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(query)
  });

  if (!response.ok) {
    throw new Error(`PostHog request failed with status ${response.status}`);
  }

  return response.json();
}

function extractFirstNumber(payload) {
  const row = payload?.results?.[0];
  if (Array.isArray(row)) return Number(row[row.length - 1] || 0);
  if (typeof row === "number") return row;
  return 0;
}

async function main() {
  if (!projectId || !apiKey) {
    console.log("PostHog credentials missing. Skipping fetch-posthog.");
    process.exit(0);
  }

  const since = isoDaysAgo(lookbackDays);

  const commonFilters = `timestamp >= toDateTime('${since}')`;
  const sessionQuery = {
    query: {
      kind: "HogQLQuery",
      query: `SELECT count(DISTINCT properties.$session_id) FROM events WHERE event = '${pageviewEvent}' AND ${commonFilters}`
    }
  };
  const trialQuery = {
    query: {
      kind: "HogQLQuery",
      query: `SELECT count(*) FROM events WHERE event = '${trialEvent}' AND ${commonFilters}`
    }
  };
  const activationQuery = {
    query: {
      kind: "HogQLQuery",
      query: `SELECT round((countIf(event = '${activationEvent}') * 100.0) / nullIf(countIf(event = '${trialEvent}'), 0), 2) FROM events WHERE event IN ('${trialEvent}', '${activationEvent}') AND ${commonFilters}`
    }
  };

  const [sessionPayload, trialPayload, activationPayload] = await Promise.all([
    queryPostHog(sessionQuery),
    queryPostHog(trialQuery),
    queryPostHog(activationQuery)
  ]);

  const output = {
    source: "posthog",
    fetchedAt: new Date().toISOString(),
    config: {
      host,
      projectId,
      lookbackDays,
      trialEvent,
      activationEvent,
      pageviewEvent
    },
    metrics: {
      sessions: extractFirstNumber(sessionPayload),
      trial_starts: extractFirstNumber(trialPayload),
      activation_rate: `${extractFirstNumber(activationPayload)}%`
    },
    insights: {
      notes: "Assumption: sessions are distinct $session_id on pageview events within the lookback window."
    }
  };

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Updated ${path.relative(rootDir, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
