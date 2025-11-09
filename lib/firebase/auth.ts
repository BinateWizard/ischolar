import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from "firebase/auth";
import { auth } from "./config";

export async function signUp(email: string, password: string, userData: {
  lastName: string;
  firstName: string;
  middleInitial?: string;
}) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Send email verification
  await sendEmailVerification(userCredential.user);
  
  // Store pending user data temporarily (will create profile after verification)
  // We'll pass this data to the waiting page
  return {
    user: userCredential.user,
    userData
  };
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Check if email is verified
  if (!userCredential.user.emailVerified) {
    // Sign out unverified user
    await firebaseSignOut(auth);
    throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
  }
  
  // Sync profile if needed
  const res = await fetch('/api/auth/sync-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: userCredential.user.uid,
      email: userCredential.user.email
    })
  });

  if (!res.ok) {
    throw new Error('Failed to sync profile');
  }

  return userCredential.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // Always show account chooser to avoid silent auto-select of cached account
  provider.setCustomParameters({ prompt: 'select_account' });
  const { user } = await signInWithPopup(auth, provider);

  // Sync profile (no email verification required for Google)
  const res = await fetch('/api/auth/sync-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      lastName: user.displayName?.split(' ').slice(-1).join(' ') || '',
      firstName: user.displayName?.split(' ').slice(0, -1).join(' ') || (user.displayName ?? ''),
      middleInitial: null
    })
  });

  if (!res.ok) {
    throw new Error('Failed to sync profile');
  }

  return user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function checkEmailVerified(user: User) {
  await user.reload();
  return user.emailVerified;
}

export { auth };
