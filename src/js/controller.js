import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/* ----------------------------------------------------------------- */

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.spinner();

    // update results view (marking selected recipe) and bookmarks
    resultsView.update(model.loadSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // fetching recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const constrolSearchResults = async function () {
  try {
    // get search query
    const query = searchView.getQuery();

    if (!query) return;

    // fetching search results
    await model.loadSearchResults(query);

    // rendering results
    resultsView.render(model.loadSearchResultsPage());

    // render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // rendering results
  resultsView.render(model.loadSearchResultsPage(goToPage));

  // render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe servings (in state)
  model.updateServings(newServings);
  // update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe);
  }

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.spinner();

    // uplaod new recipe data
    await model.uploadRecipe(newRecipe);

    // sucess message
    addRecipeView.renderSuccess();

    // Render recipe
    recipeView.render(model.state.recipe);

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // change id to URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(constrolSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
