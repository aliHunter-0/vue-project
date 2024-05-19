import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: hide the important data
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAYSqXduVg9_E7GyQihFFEtHDyQvI9h7cw',
  authDomain: 'aswar-f5aec.firebaseapp.com',
  projectId: 'aswar-f5aec',
  storageBucket: 'aswar-f5aec.appspot.com',
  messagingSenderId: '851867190895',
  appId: '1:851867190895:web:a424b9fa800e92c87daf9a'
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const auth = getAuth();
