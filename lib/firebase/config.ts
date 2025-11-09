import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5N4mTdbxOYWuj84fAo7c6eB6j4TwDyhE",
  authDomain: "osas-ischolar.firebaseapp.com",
  projectId: "osas-ischolar",
  storageBucket: "osas-ischolar.firebasestorage.app",
  messagingSenderId: "227229759785",
  appId: "1:227229759785:web:bd146290e5cb3df3095f38",
  measurementId: "G-FX8ERMSHHY"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
