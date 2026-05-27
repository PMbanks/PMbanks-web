// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Firebase Auth
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyA7wlGw9itPf3rLzzCuFzcJyiNFHT5k6F8",
  authDomain: "dashboard-game-pm.firebaseapp.com",
  databaseURL: "https://dashboard-game-pm-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dashboard-game-pm",
  storageBucket: "dashboard-game-pm.firebasestorage.app",
  messagingSenderId: "613826344552",
  appId: "1:613826344552:web:d40176f4b4802900d66ddd",
  measurementId: "G-H4498TTX2L"
};
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const db = getFirestore(app);
export {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
};