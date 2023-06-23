// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7OLrsdOWoiMxQeNO2Qjzs4Iqm6Yeig1Q",
  authDomain: "lendsqr-festusprogram.firebaseapp.com",
  projectId: "lendsqr-festusprogram",
  storageBucket: "lendsqr-festusprogram.appspot.com",
  messagingSenderId: "446659033379",
  appId: "1:446659033379:web:4b9fd979c3173f1df87496",
  measurementId: "G-KQ718CGMBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app); 
const analytics = getAnalytics(app);