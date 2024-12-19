import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();
    
    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
    
    console.log('Recipe data:', model.state.recipe);

  } catch (error) {
    console.error(error);
    recipeView.renderError(`${error.message}`);
  }
};

const controlSearchResults = async function() {
  try {
    console.log('Initiating search...');
    
    // 1) Get search query
    const query = searchView.getQuery();
    console.log('Search query:', query);
    if(!query) return;

    // 2) Load search results
    console.log('Loading search results...');
    await model.loadSearchResults(query);
    console.log('Search results loaded:', model.state.search.results);

    // 3) Render results
    console.log('Rendering results...');
    resultsView.render(model.getSearchResultsPage());
    console.log('Results rendered');

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.error('Error in controlSearchResults:', err);
    resultsView.renderError();
  }
};

const controlPagination = function(goToPage) {
  console.log('Pag controller');
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // If newServings is not provided, use the current servings
  if (!newServings) {
    newServings = model.state.recipe.servings;
  }

  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

}

init();