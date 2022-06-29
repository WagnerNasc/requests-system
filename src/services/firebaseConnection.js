import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCIAGpRSBfGlUoBNroYUV8vGurdyjI45g8",
    authDomain: "sistema-os-8d106.firebaseapp.com",
    projectId: "sistema-os-8d106",
    storageBucket: "sistema-os-8d106.appspot.com",
    messagingSenderId: "112293136732",
    appId: "1:112293136732:web:8a0eb612bf9cb05ec11999",
    measurementId: "G-E50CPSPFLJ"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase;