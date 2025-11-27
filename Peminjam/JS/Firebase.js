// Firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgrskuXx4XWYrHuJGWfrURSUdz7Kp_saA",
  authDomain: "arcadia-b08c0.firebaseapp.com",
  databaseURL: "https://arcadia-b08c0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arcadia-b08c0",
  storageBucket: "arcadia-b08c0.firebasestorage.app",
  messagingSenderId: "1028308009156",
  appId: "1:1028308009156:web:24bcba26f4cbf82c484991"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth + Realtime Database
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
