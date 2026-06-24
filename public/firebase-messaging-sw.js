// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyACq7Je_KnUh56rJ3AH0vi4RraPnCjx1ZU",
  authDomain: "school-management-6fb05.firebaseapp.com",
  projectId: "school-management-6fb05",
  storageBucket: "school-management-6fb05.firebasestorage.app",
  messagingSenderId: "1072274963897",
  appId: "1:1072274963897:web:7cef2e002f88e6c9fb4a68"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
