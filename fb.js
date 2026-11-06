import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import * as A from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import * as F from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
export const auth = A.getAuth(app);
export const db = F.getFirestore(app);
export const { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } = A;
export const { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, serverTimestamp } = F;
export async function getRole(user){
  const ref = doc(db, "users", user.uid);
  const s = await getDoc(ref);
  if (s.exists()) return s.data().role;
  await setDoc(ref, { email: user.email, role: "user" });
  return "user";
}
