import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJeMeCgX5MfwWH8Dyok44d7XKacLGFiBc",
  authDomain: "brescia-quest-1ddda.firebaseapp.com",
  projectId: "brescia-quest-1ddda",
  storageBucket: "brescia-quest-1ddda.firebasestorage.app",
  messagingSenderId: "57771185253",
  appId: "1:57771185253:web:92273ba5ed320363a0228c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth, db,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, signOut,
  doc, setDoc, getDoc, getDocs, updateDoc,
  arrayUnion, arrayRemove, onSnapshot,
  collection, addDoc, deleteDoc
};
