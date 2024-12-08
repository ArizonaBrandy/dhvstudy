import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnhnjHDIMuQ7xyotSgVJOlrky6Gpb2GkQ",
  authDomain: "my-app-91d91.firebaseapp.com",
  projectId: "my-app-91d91",
  storageBucket: "my-app-91d91.firebasestorage.app",
  messagingSenderId: "869842250730",
  appId: "1:869842250730:web:98106fe34f3fef6ddd6093",
  measurementId: "G-NE36H29XEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
