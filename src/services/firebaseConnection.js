import firebase from 'firebase/app';
import 'firebase/auth'; //autenticação
import 'firebase/firestore' //banco de dados
import 'firebase/storage'

let firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  };
  
  // Initialize Firebase
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase;
