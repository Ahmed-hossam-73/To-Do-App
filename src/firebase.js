// src/firebase.js
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCuQpqRE23Jgf5abPpPH7_7p7UrfVglmbk",
    authDomain: "login-system-d3cf0.firebaseapp.com",
    projectId: "login-system-d3cf0",
    storageBucket: "login-system-d3cf0.firebasestorage.app",
    messagingSenderId: "372331962312",
    appId: "1:372331962312:web:f5d04a4cb7881ba0486afd",
    measurementId: "G-DM1MZSZ38Z"
};

const app = initializeApp(firebaseConfig);

export { app };


