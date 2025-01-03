import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAI2nZzcRP09Vmugb61ztxKZG1FC9lpYg",
  authDomain: "event-planner-f074c.firebaseapp.com",
  projectId: "event-planner-f074c",
  storageBucket: "event-planner-f074c.appspot.com",
  messagingSenderId: "228038484139",
  appId: "1:228038484139:web:55676fda81a746d38757ee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore instance
export const storage = getStorage(app); // Storage instance
