import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Put your onAuthStateChanged and other profile-related code here...

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "log-in.html"; // redirect if not logged in
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    document.getElementById("email").value = user.email;
    document.getElementById("name").value = data.fullName || "";
    document.getElementById("bio").value = data.bio || "";
    if (data.profileImage) {
      document.getElementById("profileImage").src = data.profileImage;
    }
  } else {
    document.getElementById("email").value = user.email;
  }

  // Reveal the page only after loading data
  document.body.style.display = "block";
});

// Save Profile
window.saveProfile = async function () {
  const user = auth.currentUser;
  if (!user) return;

  const fullName = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const image = document.getElementById("profileImage").src;

  await setDoc(doc(db, "users", user.uid), {
    fullName,
    bio,
    profileImage: image,
  });

  Swal.fire({
    title: "Profile Saved",
    text: "Your profile has been saved!",
    icon: "success",
    confirmButtonText: "OK",
  });
};

// Upload & Zoom logic
window.uploadImage = function () {
  const file = document.getElementById("fileInput").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profileImage").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

window.triggerUpload = () => document.getElementById("fileInput").click();
window.zoomImage = () => {
  document.getElementById("zoomedImage").src =
    document.getElementById("profileImage").src;
  document.getElementById("zoomModal").style.display = "block";
};
window.closeZoom = () => {
  document.getElementById("zoomModal").style.display = "none";
};

import { signOut } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

// Logout function on profile page
window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      window.location.href = "log-in.html";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
};
