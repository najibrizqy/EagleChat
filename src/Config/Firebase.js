import firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC_59C7G_Dp6-ZmQMVZ_JEov6lqchz6MG4",
    authDomain: "chatapp-fc511.firebaseapp.com",
    databaseURL: "https://chatapp-fc511.firebaseio.com",
    projectId: "chatapp-fc511",
    storageBucket: "",
    messagingSenderId: "371814132168",
    appId: "1:371814132168:web:d6a25d039c95fafef2f8fd"
  };
firebase.initializeApp(firebaseConfig);

export const Firestore = firebase.firestore()
export default firebase;