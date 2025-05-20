document.addEventListener("DOMContentLoaded", () => {
  // Element selectors
  const signInForm = document.getElementById("signIn");
  const signUpForm = document.getElementById("signup");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  const signUpBtn = document.getElementById("signUpButton");
  const signInBtn = document.getElementById("signInButton");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const backToSignInBtn = document.getElementById("backToSignIn");

  const toggleSignUpMethodBtn = document.getElementById("toggleSignUpMethod");
  const emailGroup = document.getElementById("emailInputGroup");
  const phoneGroup = document.getElementById("phoneInputGroup");
  const emailInput = document.getElementById("rEmail");
  const phoneInput = document.getElementById("rPhone");

  const submitSignUpBtn = document.getElementById("submitSignUp"); // <-- add this

  let usingEmail = true;

  // Switch to Sign Up form
  signUpBtn.addEventListener("click", () => {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
    forgotPasswordForm.style.display = "none";
  });

  // Switch to Sign In form
  signInBtn.addEventListener("click", () => {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    forgotPasswordForm.style.display = "none";
  });

  // Switch to Forgot Password form
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    signInForm.style.display = "none";
    signUpForm.style.display = "none";
    forgotPasswordForm.style.display = "block";
  });

  // Back to Login from Forgot Password
  backToSignInBtn.addEventListener("click", () => {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    forgotPasswordForm.style.display = "none";
  });

  // Toggle Sign Up method (email or phone)
  toggleSignUpMethodBtn.addEventListener("click", () => {
    usingEmail = !usingEmail;

    if (usingEmail) {
      emailGroup.style.display = "block";
      emailInput.required = true;

      phoneGroup.style.display = "none";
      phoneInput.required = false;
      phoneInput.value = "";

      toggleSignUpMethodBtn.textContent = "Sign up with phone instead";
    } else {
      phoneGroup.style.display = "block";
      phoneInput.required = true;

      emailGroup.style.display = "none";
      emailInput.required = false;
      emailInput.value = "";

      toggleSignUpMethodBtn.textContent = "Sign up with email instead";
    }
  });

  // ✅ Attach Sign Up button listener safely here
});

const container = document.getElementById("glow-container");

for (let i = 0; i < 100; i++) {
  const glow = document.createElement("div");
  glow.classList.add("glowing");

  // Random position
  glow.style.top = `${Math.random() * 100}vh`;
  glow.style.left = `${Math.random() * 100}vw`;

  // Random animation duration and delay
  glow.style.animationDuration = `${5 + Math.random() * 5}s`;
  glow.style.animationDelay = `${Math.random() * 3}s`;

  const span = document.createElement("span");
  const colorIndex = Math.floor(Math.random() * 3) + 1;
  span.dataset.color = colorIndex;

  glow.appendChild(span);
  container.appendChild(glow);
}


      document.addEventListener("DOMContentLoaded", () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") document.body.classList.add("dark-mode");

        const fontSize = localStorage.getItem("fontSize") || "medium";
        document.body.style.fontSize =
          fontSize === "small"
            ? "14px"
            : fontSize === "large"
            ? "18px"
            : "16px";
      });

      function toggleMenu1() {
        const menu = document.getElementById("profileDropdown");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      }

      function showBMIDetail(category) {
        let message = "";

        switch (category) {
          case "underweight":
            message =
              "Underweight: BMI less than 18.5. A healthy weight should be targeted.";
            break;
          case "normal":
            message =
              "Normal: BMI between 18.5 and 24.9. Maintain a balanced diet and regular exercise.";
            break;
          case "overweight":
            message =
              "Overweight: BMI between 25 and 29.9. Consider weight loss strategies for better health.";
            break;
          case "obese1":
            message =
              "Obese I: BMI between 30 and 34.9. Seek a healthcare provider’s advice for weight management.";
            break;
          case "obese2":
            message =
              "Obese II: BMI between 35 and 39.9. Medical intervention may be necessary.";
            break;
          default:
            message = "Category not found.";
        }

        Swal.fire({
          title: `${
            category.charAt(0).toUpperCase() + category.slice(1)
          } BMI Category`,
          text: message,
          icon: "info",
          confirmButtonText: "Got it!",
        });
      }

      function search() {
        const query = document.getElementById("searchInput").value;
        alert(`Searching for: ${query}`);
      }

      function showSuggestions(value) {
        console.log("Suggestions for:", value);
      }