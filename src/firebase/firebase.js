import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpn3pNadNOnFPGHKZEQh-xaJLs-4sbojg",
  authDomain: "eventease-demo.firebaseapp.com",
  projectId: "eventease-demo",
  storageBucket: "eventease-demo.firebasestorage.app",
  messagingSenderId: "50184988526",
  appId: "1:50184988526:web:a7ece9b6c3ac1f95de437f",
  measurementId: "G-9RFTPWMYY8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
