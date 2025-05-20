// account.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXOd3zsVsDSvAuoUABNkrn-MZ5xMPG-aM",
  authDomain: "login-ef126.firebaseapp.com",
  projectId: "login-ef126",
  storageBucket: "login-ef126.appspot.com",
  messagingSenderId: "431686214212",
  appId: "1:431686214212:web:44accb10e1f7c3b1c59211",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "log-in.html";
    } else {
      document.body.style.display = "block";

      if (typeof loadBMIFromFirebase === 'function') {
        loadBMIFromFirebase();
      } else {
        console.warn("loadBMIFromFirebase is not defined yet");
      }
    }
  });
});



// ✅ Define the function globally so authGuard.js can access it
window.loadBMIFromFirebase = async function () {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No user signed in, cannot load BMI.");
    return;
  }

  try {
    const docRef = doc(db, "bmi", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const bmiData = docSnap.data();
      document.getElementById("bmiValue").textContent = bmiData.bmi || "N/A";
      document.getElementById("bmiCategory").textContent = bmiData.category || "N/A";
    } else {
      console.log("No BMI data found in Firestore.");
    }
  } catch (error) {
    console.error("Error loading BMI:", error);
  }
};
