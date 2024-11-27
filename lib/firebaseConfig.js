import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu35LGLzDjskpaDlJ5OGymddCsDToPLMM",
  authDomain: "subtrack-d4d91.firebaseapp.com",
  projectId: "subtrack-d4d91",
  storageBucket: "subtrack-d4d91.firebasestorage.app",
  messagingSenderId: "170510822100",
  appId: "1:170510822100:web:e4bdc1d97ad2f4c8a9a941",
  measurementId: "G-5LFZGGTWNF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { app, auth };
