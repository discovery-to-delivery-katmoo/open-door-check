import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadMemberPhoto(memberId: string, file: File) {
  const photoRef = ref(storage, `members/${memberId}/${file.name}`);
  await uploadBytes(photoRef, file);
}
