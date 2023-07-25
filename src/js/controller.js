import * as model from './model.js';
import recipeView from './views/recipeView.js';
import bookMarkView from './views/bookMarkView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';
import { MODAL_CLOSE_TIMEOUT } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    let id = window.location.hash.slice(1);
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    resultsView.update(model.getSearchResultsPage());

    recipeView.render(model.state.recipe);
    bookMarkView.update(model.state.bookMarks);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlPagination = async function (page) {
  resultsView.renderSpinner();
  resultsView.render(model.getSearchResultsPage(page));
  model.state.search.currentPage = page;
  paginationView.render(model.state.search);
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    searchView.clearInput();
    model.state.search.currentPage = 1;
    controlPagination(model.state.search.currentPage);
  } catch (err) {
    resultsView.renderError();
    console.log(err);
  }
};

const controlServings = function (newValue) {
  if (newValue <= 0) return;
  model.updateServings(newValue);
  recipeView.update(model.state.recipe);
};

const controlBookMark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  bookMarkView.render(model.state.bookMarks);
};

const controlBookMarkRender = function () {
  bookMarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIMEOUT);

    bookMarkView.render(model.state.bookMarks);

    // change id in a url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err);
    return;
  }
};

// controlRecipes();
const init = function () {
  bookMarkView.addHandlerBookmarksRender(controlBookMarkRender);
  recipeView.addHandlerBookMark(controlBookMark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);

  // addRecipeView.addHandlerOpenWindow();
};
init();
