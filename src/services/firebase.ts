import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────
// SETUP: Replace these with your Firebase project config.
// Go to console.firebase.google.com → New Project → Web App
// → Project Settings → Your Apps → SDK setup → Config
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

function getApp() {
  if (!isFirebaseConfigured()) return null;
  if (getApps().length > 0) return getApps()[0];
  return initializeApp(firebaseConfig);
}

export interface Roadmap {
  id?: string;
  title: string;
  description: string;
  topics: string[];
  source: string;
  createdAt?: any;
}

export function subscribeToRoadmaps(callback: (roadmaps: Roadmap[]) => void): () => void {
  const app = getApp();
  if (!app) {
    callback([]);
    return () => {};
  }

  const db = getFirestore(app);
  const q = query(collection(db, 'roadmaps'), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const roadmaps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Roadmap[];
    callback(roadmaps);
  });
}

export async function addRoadmap(roadmap: Omit<Roadmap, 'id' | 'createdAt'>): Promise<void> {
  const app = getApp();
  if (!app) throw new Error('Firebase not configured');

  const db = getFirestore(app);
  await addDoc(collection(db, 'roadmaps'), {
    ...roadmap,
    createdAt: serverTimestamp(),
  });
}
