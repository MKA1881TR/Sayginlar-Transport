import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import * as A from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import * as F from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
export const auth = A.getAuth(app);
export const db = F.getFirestore(app);
export const { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } = A;
export const { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, limit, onSnapshot, serverTimestamp } = F;

export const isAdminRole = r => r === "admin" || r === "owner";
export const isStaffRole = r => r === "admin" || r === "owner" || r === "editor";

export async function getRole(user){
  const ref = doc(db, "users", user.uid);
  const s = await getDoc(ref);
  if (s.exists()) return s.data().role;
  await setDoc(ref, { email: user.email, role: "user" });
  return "user";
}
// Giriş durumu/rol değişince cb(role, user) çağrılır. Giriş yoksa cb(null, null).
export function watchRole(cb){
  onAuthStateChanged(auth, async u => {
    if (!u) { cb(null, null); return; }
    let r = "user"; try { r = await getRole(u); } catch (e) { console.error(e); }
    cb(r, u);
  });
}
