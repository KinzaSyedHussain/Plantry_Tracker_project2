// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNmmtlmvCyyW9C05xW0AQ8AKaCkbk4yPo",
  authDomain: "inventory-management-4b0f0.firebaseapp.com",
  projectId: "inventory-management-4b0f0",
  storageBucket: "inventory-management-4b0f0.appspot.com",
  messagingSenderId: "638035241016",
  appId: "1:638035241016:web:4944b011b7dba7c7d31ecd",
  measurementId: "G-TRQN3JV10V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}