// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlmO_96rV9Av5xWk3lIGc3-yRlBKB18so",
  authDomain: "healthsystem-9e2ee.firebaseapp.com",
  projectId: "healthsystem-9e2ee",
  storageBucket: "healthsystem-9e2ee.firebasestorage.app",
  messagingSenderId: "607139472362",
  appId: "1:607139472362:web:03ea9926659c673423c893",
  measurementId: "G-4XPJM4Q6CD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
