import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnP48Fj9nA3_oDCkioh0gQGrlOFak2O4Y",
  authDomain: "imageuploaddb-a23fc.firebaseapp.com",
  projectId: "imageuploaddb-a23fc",
  storageBucket: "imageuploaddb-a23fc.appspot.com",
  messagingSenderId: "988978605065",
  appId: "1:988978605065:web:09499f471b876c89bf1cd8"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const imageDB = getStorage(app);
