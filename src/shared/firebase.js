// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyAMUQ0906fX2gFU7X9IjImmmJITCjpVMPA",
    authDomain: "image-community-c6d79.firebaseapp.com",
    projectId: "image-community-c6d79",
    storageBucket: "image-community-c6d79.appspot.com",
    messagingSenderId: "433387373080",
    appId: "1:433387373080:web:a36b87641f97510af0b96d",
    measurementId: "G-YF8QZ9GP19",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();
const apiKey = firebaseConfig.apiKey;

export { auth, apiKey };
