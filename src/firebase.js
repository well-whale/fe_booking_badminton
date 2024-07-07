// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZHgJXM3RBDAB6Gq6n6iqZmWIAE90EZ9Y",
  authDomain: "imagedb-d5b28.firebaseapp.com",
  projectId: "imagedb-d5b28",
  storageBucket: "imagedb-d5b28.appspot.com",
  messagingSenderId: "479927851795",
  appId: "1:479927851795:web:e7bef78f9a94e249f6d8e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;