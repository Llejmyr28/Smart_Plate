// Import Firebase modules
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Initialize Firebase
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDXOd3zsVsDSvAuoUABNkrn-MZ5xMPG-aM",
  authDomain: "login-ef126.firebaseapp.com",
  projectId: "login-ef126",
  storageBucket: "login-ef126.appspot.com",
  messagingSenderId: "431686214212",
  appId: "1:431686214212:web:44accb10e1f7c3b1c59211",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function loadBMIFromFirebase(uid) {
  const q = query(collection(db, "bmiResults"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let latestDoc = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!latestDoc || data.timestamp?.toMillis() > latestDoc.timestamp?.toMillis()) {
        latestDoc = data;
      }
    });

    if (latestDoc) {
      document.getElementById("bmiResult").textContent =
        `Your BMI is: ${latestDoc.bmi} (${latestDoc.category.toUpperCase()})`;
      document.getElementById("recommendedEnergy").textContent =
        `Recommended Energy Intake: ${latestDoc.energyMin} - ${latestDoc.energyMax} kcal/day`;
      document.getElementById("recommendedWater").textContent =
        `Recommended Water Intake: ${latestDoc.waterLiters} L/day`;

      // Optional: Store in localStorage
      localStorage.setItem("bmiResult", JSON.stringify(latestDoc));
    }
  } else {
    console.log("No BMI records found for this user.");
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadBMIFromFirebase(user.uid);
  } else {
    // Optional: Redirect to login or clear content
    console.log("User not logged in.");
  }
});
