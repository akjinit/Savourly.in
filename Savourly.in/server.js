let searchBtn = document.querySelector(".search-button");
let searchBox = document.querySelector(".search-box");
let recipeContainer = document.querySelector(".recipe-container");
let frontFace = document.querySelector(".front-face");
let recipePopup = document.querySelector(".recipe-popup");
let recipeCloseBtn = document.querySelector(".recipe-popup button")
let recipeDetails = document.querySelector(".recipe-details");
const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";


function fetchIngredients(meal)  //Function to fetch ingredients
{
    let ingredientList = "";
    let ingredient;
    let measurement;
    for (let i = 1; i <= 20; i++) {
        ingredient = meal[`strIngredient${i}`]
        if (ingredient) {
            measurement = meal[`strMeasure${i}`];
            ingredientList += `<li>${measurement} ${ingredient}</li>`
        }
        else {
            break;
        }
    }
    return ingredientList;
}


function openRecipePopup(meal) {
    recipePopup.style.display = "block";
    recipeDetails.innerHTML="";
    recipeDetails.innerHTML = `
    <h1 class="recipeName">${meal.strMeal}</h1>
    <ul class="ingredientList"><h2>Ingredients:</h2>${fetchIngredients(meal)}<ul>
    <div class="recipeInstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>`

}


async function fetchRecipe(key) {
    frontFace.innerHTML = "<h2>Fetching Recipes...</h2><p>good recepes come to those who wait.</p><div class=loader></div>";
    recipeDetails.innerHTML = "";
    recipeContainer.innerHTML = "";
    try {
        let res = await fetch(url + key);
        let data = await res.json();
        frontFace.innerHTML = "<h3>Fetched!  Revealing now...<h3><p><i>feel free to view the recipies and try them at your own comfort</i></p>";
        for (let meal of data.meals) {
            let recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><b>${meal.strArea}</b> Dish</p>
            <p>Belongs to <b>${meal.strCategory}</b> category.</p>`;

            let button = document.createElement("button");
            button.innerText = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding Event listener to button
            button.addEventListener("click", () => {
                openRecipePopup(meal);
            })
            recipeContainer.appendChild(recipeDiv);
        }

    }
    catch(error)
    {
        frontFace.innerHTML = "<h1>Error in fetching recipes.</h1><p><i>That could be a typo</i></p> <ul><b>Here are our few recomandations for you :</b><li>Search for cakes.</li><li>Chicken - to find your favourite chicken dishes</li><li>Fish - for fish recipes.</li><li><u>Soup</u> - for savoury soups</li><li><u>Curry</u></li><li>You can also search for an ingredient like <u>tomato</u> or <u>egg</u> for related dishes</li></ul>";
    }
}

recipeCloseBtn.addEventListener("click", () => {
    recipePopup.style.display = "none";
})
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let searchVal = searchBox.value;
    if (!searchVal) {
        frontFace.innerHTML = "<h3>Please type your preferred dish in the searchbox.</h3><ul><b>Here are our few recomandations for you :</b><li>Search for cakes.</li><li>Chicken - to find your favourite chicken dishes</li><li>Fish - for fish recipes.</li><li><u>Soup</u> - for savoury soups</li><li><u>Curry</u></li><li>You can also search for an ingredient like <u>tomato</u> or <u>egg</u> for related dishes</li></ul>";
        return;
    }
    fetchRecipe(searchVal);
    recipePopup.style.display = "none";
})