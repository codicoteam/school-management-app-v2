import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging"; // Added getMessaging

/**
 * WARNING: Replace the following Firebase config with your own project's configuration.
 * You can find your config in the Firebase Console -> Project Settings -> General -> Your apps.
 * For the chat feature to work, you need to:
 * 1. Enable Firestore in your Firebase project.
 * 2. Create an index for the 'messages' collection:
 *    - Collection: messages
 *    - Fields: participants (Array), createdAt (Descending)
 */

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyACq7Je_KnUh56rJ3AH0vi4RraPnCjx1ZU",
  authDomain: "school-management-6fb05.firebaseapp.com",
  projectId: "school-management-6fb05",
  storageBucket: "school-management-6fb05.firebasestorage.app",
  messagingSenderId: "1072274963897",
  appId: "1:1072274963897:web:7cef2e002f88e6c9fb4a68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app); // Initialized messaging

export default app;
