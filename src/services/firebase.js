import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMacwdf0ltK-JL6_ErdR9jaV8yJlGrOJc",
  authDomain: "letsdooit---final-edition.firebaseapp.com",
  projectId: "letsdooit---final-edition",
  storageBucket: "letsdooit---final-edition.firebasestorage.app",
  messagingSenderId: "162170588177",
  appId: "1:162170588177:web:152261bfc17674451df5b0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
}
