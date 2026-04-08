import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "data", "sources", "stripe.json");

const secretKey = process.env.STRIPE_SECRET_KEY;
const lookbackDays = Number(process.env.STRIPE_LOOKBACK_DAYS || 7);
const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();

function unixDaysAgo(days) {
  return Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);
}

async function fetchStripeCharges(createdGte) {
  const params = new URLSearchParams({
    limit: "100",
    "created[gte]": String(createdGte)
  });

  const response = await fetch(`https://api.stripe.com/v1/charges?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Stripe request failed with status ${response.status}`);
  }

  return response.json();
}

function formatMoney(minorUnits, code) {
  const major = minorUnits / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code.toUpperCase()
  }).format(major);
}

async function main() {
  if (!secretKey) {
    console.log("Stripe secret key missing. Skipping fetch-stripe.");
    process.exit(0);
  }

  const createdGte = unixDaysAgo(lookbackDays);
  const payload = await fetchStripeCharges(createdGte);
  const charges = (payload.data || []).filter((charge) => charge.paid && !charge.refunded);
  const currencyCharges = charges.filter((charge) => charge.currency?.toLowerCase() === currency);

  const grossMinor = currencyCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  const refundedMinor = currencyCharges.reduce((sum, charge) => sum + (charge.amount_refunded || 0), 0);
  const netMinor = grossMinor - refundedMinor;

  const output = {
    source: "stripe",
    fetchedAt: new Date().toISOString(),
    config: {
      lookbackDays,
      currency
    },
    metrics: {
      orders_week: currencyCharges.length,
      gross_revenue_week: formatMoney(grossMinor, currency),
      net_revenue_week: formatMoney(netMinor, currency)
    },
    raw: {
      charge_count: payload.data?.length || 0,
      paid_charge_count: charges.length
    }
  };

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Updated ${path.relative(rootDir, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
