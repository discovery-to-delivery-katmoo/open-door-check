import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function addBook(title: string) {
  const uid = auth.currentUser!.uid;
  await addDoc(collection(db, "users", uid, "books"), { title });
}

export async function listBooks() {
  const uid = auth.currentUser!.uid;
  const snap = await getDocs(collection(db, "users", uid, "books"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
