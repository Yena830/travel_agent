// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXGl6nCMCzNZZLFSaZGlNQhWmdRywtqgE",
  authDomain: "web-project-e04f5.firebaseapp.com",
  projectId: "web-project-e04f5",
  storageBucket: "web-project-e04f5.appspot.com",
  messagingSenderId: "566061953400",
  appId: "1:566061953400:web:e3ca12b603462ceeab188d",
  measurementId: "G-EFNJBK9C71",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
