import "dotenv/config";
import admin from "firebase-admin";
import { LibreLinkClient } from "libre-link-unofficial-api";

function getFirebaseServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT secret.");
}

const serviceAccount = getFirebaseServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const client = new LibreLinkClient({
  credentials: {
    email: process.env.LIBRE_LINK_EMAIL,
    password: process.env.LIBRE_LINK_PASSWORD,
  },
  lluVersion: process.env.LIBRE_LINK_UP_VERSION || "4.7.0",
  apiUrl: process.env.LIBRE_LINK_API_URL || "https://api.libreview.io",
});

function normalizeTrend(trendType) {
  if (!trendType) return "unknown";

  const trend = String(trendType).toLowerCase();

  if (trend.includes("flat")) return "flat";
  if (trend.includes("up")) return "up";
  if (trend.includes("down")) return "down";

  return trend;
}

async function main() {
  console.log("Logging into LibreLinkUp...");

  if (!process.env.LIBRE_LINK_EMAIL || !process.env.LIBRE_LINK_PASSWORD) {
    throw new Error("LibreLinkUp email or password is missing.");
  }

  await client.login();

  console.log("Reading glucose...");
  const reading = await client.read();

  console.log("Libre reading:", reading);

  const value = Number(reading.value);
  const timestamp = reading.timestamp ? new Date(reading.timestamp) : new Date();

  if (!value || Number.isNaN(value)) {
    throw new Error("No valid glucose value received from LibreLinkUp.");
  }

  const doc = {
    value,
    unit: "mg/dL",
    trend: normalizeTrend(reading.trendType),
    source: "librelinkup-github",
    timestamp: admin.firestore.Timestamp.fromDate(timestamp),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("users/main/glucoseReadings").add(doc);

  await db.collection("users").doc("main").set(
    {
      latestGlucose: doc.value,
      latestTrend: doc.trend,
      latestSource: doc.source,
      latestUpdatedAt: doc.timestamp,
    },
    { merge: true }
  );

  console.log("Saved to Firebase:", doc);
}

main().catch((err) => {
  console.error("SYNC FAILED:");
  console.error(err);
  process.exit(1);
});