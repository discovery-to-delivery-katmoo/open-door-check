import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyFAKE_EXAMPLE_not_real_03",
  authDomain: "reading-list-demo.firebaseapp.com",
  projectId: "reading-list-demo",
  storageBucket: "reading-list-demo.appspot.com",
  appId: "1:000000000000:web:fakeexample03",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
