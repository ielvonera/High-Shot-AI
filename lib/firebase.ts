
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfH_TNAtnmQTSz7n01mKVWXQoZ0FskBTI",
  authDomain: "modelgen-ai.firebaseapp.com",
  databaseURL: "https://modelgen-ai-default-rtdb.firebaseio.com",
  projectId: "modelgen-ai",
  storageBucket: "modelgen-ai.firebasestorage.app",
  messagingSenderId: "1061439292022",
  appId: "1:1061439292022:web:2f3cd7cb903913211f5557",
  measurementId: "G-E7SDHXC0F3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
