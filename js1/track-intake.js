// track-intake.js
import {
  calculateBMI,
  getBMICategory,
  calculateWaterIntake,
  calculateCalorieIntake
} from './healthUtils.js';

import {
  getFirestore, collection, addDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js';

import {
  getAuth, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js';

// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyDXOd3zsVsDSvAuoUABNkrn-MZ5xMPG-aM",
  authDomain: "login-ef126.firebaseapp.com",
  projectId: "login-ef126",
  appId: "1:431686214212:web:44accb10e1f7c3b1c59211",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById('health-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const waterIntake = calculateWaterIntake(weight);
  const calorieIntake = calculateCalorieIntake(weight, height, age, gender);

  const user = auth.currentUser;

  if (user) {
    try {
      await addDoc(collection(db, 'intakeRecords'), {
        uid: user.uid,
        weight,
        height,
        age,
        gender,
        bmi,
        bmiCategory,
        waterIntake,
        calorieIntake,
        timestamp: serverTimestamp()
      });
      displayResult({ bmi, bmiCategory, waterIntake, calorieIntake });
    } catch (error) {
      resultDiv.innerHTML = `<p style="color:red;">Error saving to Firebase: ${error.message}</p>`;
    }
  } else {
    resultDiv.innerHTML = '<p style="color:red;">Please log in to save your data.</p>';
  }
});

function displayResult({ bmi, bmiCategory, waterIntake, calorieIntake }) {
  resultDiv.innerHTML = `
    <h3>Your Results</h3>
    <p><strong>BMI:</strong> ${bmi} (${bmiCategory})</p>
    <p><strong>Recommended Water Intake:</strong> ${waterIntake} liters/day</p>
    <p><strong>Recommended Calorie Intake:</strong> ${calorieIntake} kcal/day</p>
  `;
}
