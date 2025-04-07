import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config();


const serviceAccount = JSON.parse(
  Buffer.from(process.env.APP_FIREBASE_ADMIN_JSON, "base64").toString("utf-8")
);

console.log(serviceAccount)


const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET,
});

export const db = getFirestore("(default)");
