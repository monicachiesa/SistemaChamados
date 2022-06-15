import firebase from 'firebase/app';
import 'firebase/auth'; //autenticação
import 'firebase/firestore' //banco de dados

let firebaseConfig = {
    apiKey: "AIzaSyASZvESWEACD7J6nT1u2tyvikGlIu4eOf0",
    authDomain: "sistemachamados-781a9.firebaseapp.com",
    projectId: "sistemachamados-781a9",
    storageBucket: "sistemachamados-781a9.appspot.com",
    messagingSenderId: "437280863615",
    appId: "1:437280863615:web:9bebe8888b368aaaa1964a",
    measurementId: "G-N69M7YV52V"
  };
  
  // Initialize Firebase
  if (!firebase.apps.length) {
 firebase.initializeApp(firebaseConfig);
  }

  export default firebase;