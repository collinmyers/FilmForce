import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZn0HoLYgqGhKpI0LgZbdBJ7ESU2lamaM",
  authDomain: "filmforce-bd048.firebaseapp.com",
  projectId: "filmforce-bd048",
  storageBucket: "filmforce-bd048.appspot.com",
  messagingSenderId: "1039079885946",
  appId: "1:1039079885946:web:e3862bba4981a7ae087fc3",
  measurementId: "G-H52VEXZQ5P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);