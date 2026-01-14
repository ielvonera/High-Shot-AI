
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Plan → Credit Sync Logic
export const syncPlanWithCredits = async (uid: string, plan: 'free' | 'pro' | 'agency') => {
  let credits = 10;
  let bonusUsed = false;

  switch (plan) {
    case "free":
      credits = 10;
      break;
    case "pro":
      credits = 200; // 150 base + 50 first-month bonus
      bonusUsed = true;
      break;
    case "agency":
      credits = 600;
      break;
    default:
      credits = 10;
  }

  await updateDoc(doc(db, "users", uid), {
    plan,
    credits,
    bonusCreditsUsed: bonusUsed,
    planStartedAt: serverTimestamp(),
    planRenewAt: serverTimestamp()
  });
};

// Sign up
export const signUp = async (email: string, password: string, name: string) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(result.user, {
    displayName: name,
  });

  // Initial Account Opening: 10 Free Units given immediately
  await setDoc(doc(db, "users", result.user.uid), {
    uid: result.user.uid,
    name,
    email,
    plan: "free",
    credits: 10,
    bonusCreditsUsed: false,
    planStartedAt: serverTimestamp(),
    planRenewAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });

  return result.user;
};

// Login
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Login
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  const user = result.user;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // If new user via Google, initialize their document with 10 free units immediately
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      plan: "free",
      credits: 10,
      bonusCreditsUsed: false,
      planStartedAt: serverTimestamp(),
      planRenewAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  }

  return result;
};

// Reset Password
export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// Sign Out
export const signOut = () => {
    return firebaseSignOut(auth);
};

// Plan Upgrade Logic
export const upgradeUserPlan = async (uid: string, plan: 'free' | 'pro' | 'agency') => {
  await syncPlanWithCredits(uid, plan);
};
