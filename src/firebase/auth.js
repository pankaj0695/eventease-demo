import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export const signUpWithEmailPassword = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  // Set the display name for the newly created user
  await updateProfile(userCredential.user, {
    displayName: name,
  });
  return userCredential;
};

export const LoginWithEmailPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const LoginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const Logout = () => {
  return auth.signOut();
};
