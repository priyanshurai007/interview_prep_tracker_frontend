// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8G09wEHeTLyGp1j-ghW5B8GYypcsAUb8",
  authDomain: "interview-prep-tracker-bef6c.firebaseapp.com",
  projectId: "interview-prep-tracker-bef6c",
  storageBucket: "interview-prep-tracker-bef6c.appspot.com",
  messagingSenderId: "456059984073",
  appId: "1:456059984073:web:5b4fcec597f7a6c1f61518",
  measurementId: "G-PJG9EPV2DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
