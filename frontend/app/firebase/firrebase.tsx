// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,GithubAuthProvider} from "firebase/auth"
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-2G-RutmBEjg2nAdSCGiJcYyIfSAyTrA",
  authDomain: "musicplayer-b4558.firebaseapp.com",
  projectId: "musicplayer-b4558",
  storageBucket: "musicplayer-b4558.firebasestorage.app",
  messagingSenderId: "711422622812",
  appId: "1:711422622812:web:1eb05eb32519755d143a99",
  measurementId: "G-XC0WCN3D92"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const githubprovider = new GithubAuthProvider();
export const db = getFirestore(app);