// healthUtils.js

export function calculateBMI(weight, height) {
  const bmi = weight / ((height / 100) ** 2);
  return parseFloat(bmi.toFixed(2));
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  else if (bmi < 24.9) return 'Normal weight';
  else if (bmi < 29.9) return 'Overweight';
  else return 'Obese';
}

export function calculateWaterIntake(weight) {
  return parseFloat((weight * 0.033).toFixed(2)); // liters/day
}

export function calculateCalorieIntake(weight, height, age, gender) {
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return Math.round(bmr);
}
