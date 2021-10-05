import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAMUQ0906fX2gFU7X9IjImmmJITCjpVMPA",
    authDomain: "image-community-c6d79.firebaseapp.com",
    projectId: "image-community-c6d79",
    storageBucket: "image-community-c6d79.appspot.com",
    messagingSenderId: "433387373080",
    appId: "1:433387373080:web:a36b87641f97510af0b96d",
    measurementId: "G-YF8QZ9GP19",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };
