

function search() {
  const searchInput = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (searchInput !== "") {
    const bmiCategory = localStorage.getItem("bmiResult");
    if (bmiCategory) {
      const bmiResult = JSON.parse(bmiCategory);
      const jsonFile = `${bmiResult.category}_recipes.json`;

      fetch(jsonFile)
        .then((response) => response.json())
        .then((recipes) => {
          const matchingRecipes = recipes.filter((recipe) =>
            recipe.ingredients.some((ingredient) =>
              searchInput.includes(ingredient.toLowerCase())
            )
          );

          // Store the filtered recipes in localStorage
          localStorage.setItem(
            "searchResults",
            JSON.stringify(matchingRecipes)
          );

          // Redirect to the search results page
          window.location.href = "search-results.html";
        })
        .catch((error) => console.error("Error loading recipes:", error));
    } else {
      // Handle case where BMI category is not available
      Swal.fire({
        title: "Warning",
        text: "Please input your weight and height to calculate your BMI...",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  } else {
    // Handle case where no search term is entered
    Swal.fire({
      title: "Error!",
      text: "Please input specific ingredients.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

function findRecipesByQuery(recipes, searchQuery) {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) => searchQuery.includes(ingredient))
  );
}

function displayResultsOnSearchResultsPage() {
  const searchResultsContainer = document.getElementById("results-container");
  const searchResults = JSON.parse(localStorage.getItem("searchResults"));

  if (searchResults && searchResults.length > 0) {
    searchResultsContainer.innerHTML = ""; // Clear previous

    searchResults.forEach((recipe) => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      card.innerHTML = `
        <img src="imgresults/${recipe.name.toLowerCase().replace(/\s+/g, "-")}.jpg" 
             alt="${recipe.name} Image" class="recipe-image">

        <div class="recipe-details">
          <a href="recipe-details.html?recipe=${encodeURIComponent(JSON.stringify(recipe))}">
            ${recipe.name}
          </a>
          <p class="recipe-ingredients">${recipe.ingredients.join(", ")}</p>
        </div>
      `;

      searchResultsContainer.appendChild(card);
    });
  } else {
    searchResultsContainer.innerHTML = "<p>No matching recipes found.</p>";
  }
}



document.addEventListener(
  "DOMContentLoaded",
  displayResultsOnSearchResultsPage
);

document.addEventListener("DOMContentLoaded", () => {

  // If on recipe-details.html, show details
  if (window.location.pathname.includes("recipe-details.html")) {
    displayRecipeDetails();
  }

});
function displayRecipeDetails() {
  const recipeDetailsContainer = document.getElementById(
    "recipe-details-container"
  );
  const recipeParam = new URLSearchParams(window.location.search).get("recipe");

  if (recipeParam && !recipeDetailsContainer.innerHTML.trim()) {
    const recipe = JSON.parse(decodeURIComponent(recipeParam));

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("recipe-details");

    // Add the image to the right
    detailsDiv.innerHTML = `<div class="recipe-image">
                    <img src="imgresults/${recipe.name.toLowerCase().replace(/\s+/g, "-")}.jpg" alt="${recipe.name} Image" class="recipe-image">

                                </div>`;

    // Add recipe name and other details
    detailsDiv.innerHTML += `
            <div class="recipe-info">
                <h2>${recipe.name}</h2>
                <p><strong>Ingredients:</strong></p>
                <ul>${recipe.quantity
        .map((quantity) => `<li>${quantity}</li>`)
        .join("")}</ul>
                <p><strong>Instructions:</strong></p>
                <ol>${recipe.instructions
        .map((instruction) => `<li>${instruction}</li>`)
        .join("")}</ol>
                <p><strong>Calories:<ol>${recipe.calories}<ol></strong></p>
            </div>`;

    recipeDetailsContainer.appendChild(detailsDiv);
  } else if (!recipeParam) {
    // Handle case where no recipe details are provided
    recipeDetailsContainer.innerHTML = "<p>No recipe details found.</p>";
  }
}


function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseFloat(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;

  if (isNaN(height) || isNaN(weight) || isNaN(age)) {
    Swal.fire("Please fill in all fields correctly.");
    return;
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const category = 
    bmi < 18.5 ? "Underweight" :
    bmi < 24.9 ? "Normal" :
    bmi < 29.9 ? "Overweight" :
    "Obese";

  const recommendedEnergy = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const recommendedWater = weight * 35; // in mL
  const energyMin = Math.round(recommendedEnergy * 0.9);
  const energyMax = Math.round(recommendedEnergy * 1.1);
  const waterLiters = (recommendedWater / 1000).toFixed(1); // convert to liters

  // Update UI
  document.getElementById("bmiResult").innerText = `BMI: ${bmi.toFixed(1)} (${category})`;
  document.getElementById("recommendedEnergy").innerText = `Recommended Calories: ${Math.round(recommendedEnergy)} kcal`;
  document.getElementById("recommendedWater").innerText = `Recommended Water: ${Math.round(recommendedWater)} mL`;

  // Save to localStorage
  const bmiData = {
    bmi: bmi.toFixed(1),
    category: category,
    energyMin: energyMin,
    energyMax: energyMax,
    waterLiters: waterLiters,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem("bmiResult", JSON.stringify(bmiData));

  Swal.fire({
    icon: "success",
    title: "BMI Calculated and Saved",
    text: `BMI: ${bmi.toFixed(1)} (${category})`,
  });
}


function loadBMIResults() {
  const bmiResultElement = document.getElementById("bmiResult");
  const energyElement = document.getElementById("recommendedEnergy");
  const waterElement = document.getElementById("recommendedWater");

  const stored = localStorage.getItem("bmiResult");

  if (stored) {
    const { bmi, category, energyMin, energyMax, waterLiters } =
      JSON.parse(stored);

    bmiResultElement.textContent = `Your BMI is: ${bmi} (${category.toUpperCase()})`;
    energyElement.textContent = `Recommended Energy Intake: ${energyMin} - ${energyMax} kcal/day`;
    waterElement.textContent = `Recommended Water Intake: ${waterLiters} L/day`;
  }
}

async function loadBMIFromFirebase() {
  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in, skipping Firebase load.");
    return;
  }

  try {
    const q = query(
      collection(db, "bmiResults"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();

      // Update UI
      const bmiResultElement = document.getElementById("bmiResult");
      const energyElement = document.getElementById("recommendedEnergy");
      const waterElement = document.getElementById("recommendedWater");

      bmiResultElement.textContent = `Your BMI is: ${docData.bmi
        } (${docData.category.toUpperCase()})`;
      energyElement.textContent = `Recommended Energy Intake: ${docData.energyMin} - ${docData.energyMax} kcal/day`;
      waterElement.textContent = `Recommended Water Intake: ${docData.waterLiters} L/day`;

      // Optionally update localStorage
      localStorage.setItem("bmiResult", JSON.stringify(docData));
    } else {
      console.log("No BMI data found in Firebase for this user.");
    }
  } catch (error) {
    console.error("Error loading BMI data from Firebase:", error);
  }
}

function setRecommendedIntakes() {
  const ageInput = document.getElementById("age");
  const age = parseInt(ageInput.value);
  const gender = document.getElementById("gender").value;

  // Fetch recommended intakes based on age and gender
  fetch("recommendations.json")
    .then((response) => response.json())
    .then((data) => {
      const ageGroup = data.ageGroups.find((group) => {
        const [minAge, maxAge] = group.ageRange.split("-");
        return age >= parseInt(minAge) && age <= parseInt(maxAge);
      });

      if (ageGroup) {
        const recommendedEnergy = ageGroup[gender].energyIntake;
        const recommendedWater = ageGroup[gender].waterIntake;

        document.getElementById(
          "recommendedEnergy"
        ).textContent = `Calories: ${recommendedEnergy} kcal`;
        document.getElementById(
          "recommendedWater"
        ).textContent = `Water: ${recommendedWater} mL`;

        // Save recommended intakes to local storage
        localStorage.setItem("recommendedEnergy", recommendedEnergy);
        localStorage.setItem("recommendedWater", recommendedWater);

        // Initialize remaining intakes to 0
        localStorage.setItem("remainingEnergy", 0);
        localStorage.setItem("remainingWater", 0);

        // Display remaining intakes
        updateRemainingIntakes();

        Swal.fire({
          icon: "success",
          title: "Success",
        });
      } else {
        console.error(
          "No recommended intakes found for the specified age and gender."
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching recommended intakes:", error);
    });
}

function subtractConsumedEnergy() {
  const consumedEnergy =
    parseInt(document.getElementById("consumedEnergy").value) || 0;
  let remainingEnergy = parseInt(localStorage.getItem("remainingEnergy")) || 0;
  const recommendedEnergy =
    parseInt(localStorage.getItem("recommendedEnergy")) || 0;
  remainingEnergy += consumedEnergy; // Add consumed energy to remaining energy
  localStorage.setItem("remainingEnergy", remainingEnergy); // Cap remaining energy to recommendedEnergy
  updateRemainingIntakes();

  Swal.fire({
    icon: "success",
    title: "Success",
    text: `Remaining energy: ${remainingEnergy}/${recommendedEnergy} kcal`,
  });
}

function subtractConsumedWater() {
  const consumedWater =
    parseInt(document.getElementById("consumedWater").value) || 0;
  let remainingWater = parseInt(localStorage.getItem("remainingWater")) || 0;
  const recommendedWater =
    parseInt(localStorage.getItem("recommendedWater")) || 0;
  remainingWater += consumedWater; // Add consumed water to remaining water
  localStorage.setItem("remainingWater", remainingWater); // Cap remaining water to recommendedWater
  updateRemainingIntakes();

  Swal.fire({
    icon: "success",
    title: "Success",
    text: `Remaining water: ${remainingWater}/${recommendedWater} mL`,
  });
}


// Function to update the remaining intakes
function updateRemainingIntakes() {
  const remainingEnergy =
    parseInt(localStorage.getItem("remainingEnergy")) || 0;
  const recommendedEnergy =
    parseInt(localStorage.getItem("recommendedEnergy")) || 0;
  const remainingWater = parseInt(localStorage.getItem("remainingWater")) || 0;
  const recommendedWater =
    parseInt(localStorage.getItem("recommendedWater")) || 0;

  // Update remaining energy display
  document.getElementById(
    "remainingEnergy"
  ).textContent = `${remainingEnergy}/ ${recommendedEnergy} kcal`;

  // Update remaining water display
  document.getElementById(
    "remainingWater"
  ).textContent = `${remainingWater}/ ${recommendedWater} mL`;

  // Update progress meter for energy
  updateProgressMeter(
    remainingEnergy,
    recommendedEnergy,
    "consumedEnergyMeter"
  );

  // Update progress meter for water
  updateProgressMeter(remainingWater, recommendedWater, "consumedWaterMeter");
}

document.addEventListener("DOMContentLoaded", () => {
  // Load BMI results
  loadBMIResults();



  // Display BMI result on relevant pages
  const bmiCategory = localStorage.getItem("bmiResult");
  if (bmiCategory) {
    const bmiResult = JSON.parse(bmiCategory);
    const bmiResultElement = document.getElementById("bmiResult");
    if (bmiResultElement) {
      bmiResultElement.textContent = `Your BMI is: ${bmiResult.bmi} (${bmiResult.category.toUpperCase()})`;
    }
  }

  // Search input Enter key listener
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") search();
    });
  }

  // Show search results
  displayResultsOnSearchResultsPage();
});
