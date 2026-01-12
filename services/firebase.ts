
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  collection, 
  query, 
  where, 
  limit, 
  updateDoc, 
  addDoc, 
  serverTimestamp, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVUMhFhDzfbvF-iXthH6StOlI6mJreTmA",
  authDomain: "smart-support-for-pets.firebaseapp.com",
  projectId: "smart-support-for-pets",
  storageBucket: "smart-support-for-pets.firebasestorage.app",
  messagingSenderId: "737739952686",
  appId: "1:737739952686:web:17ecad5079401fb6ee05bf"
};

// Singleton pattern to prevent re-initialization errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Force-saves user data to Firestore. 
 * Essential to call this on every login/signup to prevent "missing document" errors later.
 */
export const syncUserToDb = async (user: FirebaseUser, extraData: any = {}) => {
  if (!user) return null;
  
  const userRef = doc(db, "users", user.uid);
  const data = {
    uid: user.uid,
    email: user.email,
    displayName: extraData.displayName || user.displayName || 'Pet Parent',
    photoURL: user.photoURL || null,
    username: extraData.username || user.displayName?.toLowerCase().replace(/\s/g, '') || user.uid.slice(0, 8),
    lastLogin: new Date().toISOString(),
    ...extraData
  };
  
  try {
    await setDoc(userRef, data, { merge: true });
    return data;
  } catch (err) {
    console.error("Firestore sync failed (check rules):", err);
    return data;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await syncUserToDb(result.user);
      return result.user;
    }
  } catch (error: any) {
    console.error("Google login error:", error.code, error.message);
    throw error;
  }
};

export const loginWithIdentifier = async (identifier: string, pass: string) => {
  try {
    let email = identifier;
    // Basic email regex to check if the identifier is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
    if (!isEmail) {
      const q = query(collection(db, "users"), where("username", "==", identifier.toLowerCase()), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Username not found. Try your email address or check your spelling.");
      }
      email = querySnapshot.docs[0].data().email;
    }
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (result.user) await syncUserToDb(result.user);
    return result.user;
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, pass: string, fullName: string, username: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      // Step 1: Update Auth Profile
      await updateProfile(result.user, { displayName: fullName });
      // Step 2: Sync to Firestore
      await syncUserToDb(result.user, { 
        displayName: fullName, 
        username: username.toLowerCase().replace(/\s/g, '') 
      });
      return result.user;
    }
    throw new Error("Failed to create user session.");
  } catch (error: any) {
    console.error("Signup error:", error.code, error.message);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: { displayName?: string, username?: string, phoneNumber?: string }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No active session found.");

  const userRef = doc(db, "users", uid);
  const firestoreData: any = { ...data };
  if (data.username) firestoreData.username = data.username.toLowerCase().replace(/\s/g, '');
  
  try {
    await setDoc(userRef, firestoreData, { merge: true });
    if (data.displayName) {
      await updateProfile(user, { displayName: data.displayName });
    }
    await user.reload();
    return auth.currentUser;
  } catch (err: any) {
    console.error("Profile update failed:", err);
    throw new Error(err.message || "Unable to save profile to database.");
  }
};

export const startChat = async (currentUserId: string, targetUserId: string) => {
  const chatsRef = collection(db, "chats");
  
  const q = query(chatsRef, where("participants", "array-contains", currentUserId));
  const querySnapshot = await getDocs(q);
  
  let existingChatId = "";
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.participants && data.participants.includes(targetUserId)) {
      existingChatId = doc.id;
    }
  });

  if (existingChatId) return existingChatId;

  const newChatDoc = await addDoc(chatsRef, {
    participants: [currentUserId, targetUserId],
    lastMessage: "",
    lastTimestamp: serverTimestamp()
  });

  return newChatDoc.id;
};

export const sendChatMessage = async (chatId: string, senderId: string, text: string) => {
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp()
  });

  await updateDoc(chatRef, {
    lastMessage: text,
    lastTimestamp: serverTimestamp()
  });
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export { onAuthStateChanged };
export type { FirebaseUser };
