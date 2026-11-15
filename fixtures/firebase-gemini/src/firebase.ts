import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyFAKE_EXAMPLE_not_real_02",
  authDomain: "recipe-helper-demo.firebaseapp.com",
  projectId: "recipe-helper-demo",
  storageBucket: "recipe-helper-demo.appspot.com",
  appId: "1:000000000000:web:fakeexample02",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const ai = getAI(app, { backend: new GoogleAIBackend() });
export const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
