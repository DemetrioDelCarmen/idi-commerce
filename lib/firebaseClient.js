import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/functions';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBUJKTCUAVSstlRkBNl0on-tPAJM08azUo",

    authDomain: "app-storage-idi.firebaseapp.com",

    projectId: "app-storage-idi",

    storageBucket: "app-storage-idi.firebasestorage.app",

    messagingSenderId: "941358666119",

    appId: "1:941358666119:web:e8c8c9b267292fbec20322",

    measurementId: "G-N39RX82SXG"

};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();
export const fieldValue = firebase.firestore.FieldValue;
export const auth = app.auth();
export const storage = app.storage();
export const functions = app.functions()