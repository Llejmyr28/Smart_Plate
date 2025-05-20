// Firebase imports and initialization
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

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



// === LOGIN ===
document.getElementById("submitSignIn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      // If not verified, sign out and show alert
      Swal.fire(
        "Email Not Verified",
        "Please verify your email before logging in.",
        "warning"
      );
      auth.signOut(); // Force sign out
      return;
    }

    Swal.fire("Success", "Login successful!", "success");
    window.location.href = "index1.html"; // uncomment if you have a redirect
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
});

window.handleSignUp = async function () {
  const username = document.getElementById("fName").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();

  if (!username) {
    Swal.fire("Missing Username", "Please enter a username.", "warning");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // ✅ Save username to Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: username,
      bio: "",
      profileImage: "https://via.placeholder.com/120" // default pic
    });

    // ✅ Send email verification
    await sendEmailVerification(user);

    Swal.fire(
      "Success",
      "Account created! A verification email has been sent. Please verify before logging in.",
      "success"
    );

    // Optionally redirect to login or account page
    // window.location.href = "login.html";

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};



// === FORGOT PASSWORD ===
document
  .getElementById("submitForgotPassword")
  .addEventListener("click", async () => {
  const resetEmail = document.getElementById("resetEmail").value.trim();

  try {
    await sendPasswordResetEmail(auth, resetEmail);
      Swal.fire(
        "Email Sent",
        "Check your inbox for reset instructions.",
        "success"
      );
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
});

document.getElementById("submitSignUp").addEventListener("click", handleSignUp);

import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

// Define named logout function
function logout() {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      window.location.href = "home.html";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
}

// Register to window
window.logout = logout;