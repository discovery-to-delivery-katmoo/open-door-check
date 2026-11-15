import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./service-account.json";

// Lets the club organiser delete members from the Members page.
const adminApp = initializeApp({ credential: cert(serviceAccount as any) }, "admin");

export async function deleteMember(memberId: string) {
  await getFirestore(adminApp).collection("members").doc(memberId).delete();
}
