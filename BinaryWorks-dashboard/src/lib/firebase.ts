import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"



const firebaseConfig = {
  apiKey: "AIzaSyAm-ulBmMieDvuPX0MmkPG86VTYhEbQKq0",
  authDomain: "medilink-dc322.firebaseapp.com",
  projectId: "medilink-dc322",
  storageBucket: "medilink-dc322.firebasestorage.app",
  messagingSenderId: "569141932091",
  appId: "1:569141932091:web:651bfe468e729291e06c1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app