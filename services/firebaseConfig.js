import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJlA01gKZ5J8ZssCP5lELviUllwQMk8Ts",
    authDomain: "filmforce-106e3.firebaseapp.com",
    projectId: "filmforce-106e3",
    storageBucket: "filmforce-106e3.appspot.com",
    messagingSenderId: "834391549808",
    appId: "1:834391549808:web:e366052b083fe0172311b5",
    measurementId: "G-57ZP0NJLQ8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);