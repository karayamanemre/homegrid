// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBldiHePndoZQnf2b5ENLZzTzzfSUcwZTs',
  authDomain: 'homegrid-15300.firebaseapp.com',
  projectId: 'homegrid-15300',
  storageBucket: 'homegrid-15300.appspot.com',
  messagingSenderId: '175399671847',
  appId: '1:175399671847:web:5f927e96fa8ff0f88ed602',
  measurementId: 'G-66CG4WEBR1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
