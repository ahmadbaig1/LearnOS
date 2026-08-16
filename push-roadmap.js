#!/usr/bin/env node
/**
 * LearnOS — Push a roadmap from your laptop to the app.
 *
 * Setup:
 *   1. npm install firebase (in this directory or globally)
 *   2. Fill in your Firebase config below (same as in src/services/firebase.ts)
 *   3. Run: node push-roadmap.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// ─── PASTE YOUR FIREBASE CONFIG HERE ──────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
// ──────────────────────────────────────────────────────────

// ─── EDIT YOUR ROADMAP HERE ───────────────────────────────
const ROADMAP = {
  title: "React + Node.js Full Stack",
  description: "Go from React basics to building a full API-backed app",
  topics: [
    "React components & JSX",
    "State & useEffect",
    "React Router",
    "Fetch & REST APIs",
    "Node.js basics",
    "Express routes",
    "MongoDB with Mongoose",
    "Auth with JWT",
    "Deploy to Vercel + Railway",
  ],
  source: "laptop",
};
// ──────────────────────────────────────────────────────────

async function main() {
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.error("❌ Fill in your Firebase config first.");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`📤 Pushing roadmap: "${ROADMAP.title}"...`);
  const ref = await addDoc(collection(db, 'roadmaps'), {
    ...ROADMAP,
    createdAt: serverTimestamp(),
  });

  console.log(`✅ Done! Roadmap ID: ${ref.id}`);
  console.log(`📱 Open LearnOS on your phone → Roadmaps tab to see it.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
