import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyFAKE_EXAMPLE_not_real_01",
  authDomain: "club-photos-demo.firebaseapp.com",
  projectId: "club-photos-demo",
  storageBucket: "club-photos-demo.appspot.com",
  appId: "1:000000000000:web:fakeexample01",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
