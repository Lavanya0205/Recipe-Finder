const apiKey = 'c803240625ca4e6791c43b10579a388c'; // Replace with your Spoonacular API key

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.querySelector('i').classList.toggle('fa-moon');
    darkModeToggle.querySelector('i').classList.toggle('fa-sun');
});
// Fetch recipes based on search query
async function getRecipes(query, diet = '') {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&diet=${diet}&apiKey=${apiKey}`);
    const data = await response.json();
    return data.results;
}

// Fetch a random recipe
async function getRandomRecipe() {
    const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`);
    const data = await response.json();
    return data.recipes[0];
}

// Fetch recipes by ingredients
async function getRecipesByIngredients(ingredients) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Debugging
        return data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

// Display recipes in the UI
async function displayRecipes(query, diet = '') {
    document.getElementById('loading-spinner').style.display = 'block'; // Show spinner
    const recipes = await getRecipes(query, diet);
    document.getElementById('loading-spinner').style.display = 'none'; // Hide spinner

    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear previous results

    if (recipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="view-recipe-btn">View Recipe</button>
            <button class="save-favorite-btn">Save Favorite</button>
        `;

        // Add event listener for "View Recipe" button
        recipeCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
            viewRecipe(recipe.id);
        });

        // Add event listener for "Save Favorite" button
        recipeCard.querySelector('.save-favorite-btn').addEventListener('click', () => {
            saveFavorite(recipe);
        });

        recipeList.appendChild(recipeCard);
    });
}

// Display recipes based on ingredients
async function displayRecipesByIngredients(ingredients) {
    document.getElementById('loading-spinner').style.display = 'block'; // Show spinner
    const recipes = await getRecipesByIngredients(ingredients);
    document.getElementById('loading-spinner').style.display = 'none'; // Hide spinner

    const recipeList = document.getElementById('ingredients-recipe-list');
    recipeList.innerHTML = ''; // Clear previous results

    if (recipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes found for these ingredients.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="view-recipe-btn">View Recipe</button>
            <button class="save-favorite-btn">Save Favorite</button>
        `;

        // Add event listener for "View Recipe" button
        recipeCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
            viewRecipe(recipe.id);
        });

        // Add event listener for "Save Favorite" button
        recipeCard.querySelector('.save-favorite-btn').addEventListener('click', () => {
            saveFavorite(recipe);
        });

        recipeList.appendChild(recipeCard);
    });
}

// Save a recipe to favorites
function saveFavorite(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isAlreadySaved = favorites.some(fav => fav.id === recipe.id);
    if (isAlreadySaved) {
        alert('This recipe is already in your favorites!');
        return;
    }
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Recipe saved to favorites!');
}

// View recipe details in a modal
async function viewRecipe(recipeId) {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
    const recipe = await response.json();

    // Display recipe details in the modal
    document.getElementById('modal-title').innerText = recipe.title;
    document.getElementById('modal-instructions').innerText = recipe.instructions || 'No instructions available.';
    document.getElementById('recipe-modal').style.display = 'flex';

    // Close modal when the close button is clicked
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('recipe-modal').style.display = 'none';
    });
}

// Event listener for search button
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    const isVegetarian = document.getElementById('vegetarian-checkbox').checked;
    const diet = isVegetarian ? 'vegetarian' : '';
    displayRecipes(query, diet);
});

// Event listener for random recipe button
document.getElementById('random-recipe-btn').addEventListener('click', async () => {
    const recipe = await getRandomRecipe();
    viewRecipe(recipe.id);
});

// Event listener for ingredients search button
document.getElementById('ingredients-search-btn').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredients-input').value.trim();
    if (!ingredients) {
        alert('Please enter at least one ingredient.');
        return;
    }
    displayRecipesByIngredients(ingredients);
});

// Display favorites when the page loads
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = ''; // Clear previous favorites

    favorites.forEach(recipe => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('recipe-card');
        favoriteCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="view-recipe-btn">View Recipe</button>
        `;

        // Add event listener for "View Recipe" button
        favoriteCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
            viewRecipe(recipe.id);
        });

        favoritesList.appendChild(favoriteCard);
    });
}

// Call this function when the page loads
displayFavorites();