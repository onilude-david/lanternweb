import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC6qjjvBQTvQCxYY8WAsG6QkSg3vlxYEPM",
    authDomain: "lantern-web-ef446.firebaseapp.com",
    projectId: "lantern-web-ef446",
    storageBucket: "lantern-web-ef446.firebasestorage.app",
    messagingSenderId: "610592248028",
    appId: "1:610592248028:web:b3886c4f56df91a1116419",
    measurementId: "G-YYKSKVJ8CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
