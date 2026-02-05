import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD06vA24QfTQ_P60L8CUCoA10h60EFIy8',
  authDomain: 'who-is-the-spy-f8359.firebaseapp.com',
  projectId: 'who-is-the-spy-f8359',
  storageBucket: 'who-is-the-spy-f8359.appspot.com',
  messagingSenderId: '282636331428',
  appId: '1:282636331428:web:f0d3bcd26d3456c791b31'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

signInAnonymously(auth);
