// js1/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXOd3zsVsDSvAuoUABNkrn-MZ5xMPG-aM",
  authDomain: "login-ef126.firebaseapp.com",
  projectId: "login-ef126",
  storageBucket: "login-ef126.appspot.com",
  messagingSenderId: "431686214212",
  appId: "1:431686214212:web:44accb10e1f7c3b1c59211",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
