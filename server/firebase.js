import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config();

// Load service account JSON file
const serviceAccount = require("../server/liar-liar-dev-firebase-adminsdk-fbsvc-b5ae4543ce.json");

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET,
});

export const db = getFirestore("(default)");
