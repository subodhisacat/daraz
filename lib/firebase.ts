import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAFRDkJfvHPLIrYnAkFdPNhZqC2dQW2QeQ",
  authDomain: "daraz-subodh.firebaseapp.com",
  projectId: "daraz-subodh",
  storageBucket: "daraz-subodh.firebasestorage.app",
  messagingSenderId: "692656252629",
  appId: "1:692656252629:web:d3ae301ebe9d1b6bd2e45c",
}

// ✅ prevent re-initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// ✅ Firestore database
const db = getFirestore(app)

export { db }
