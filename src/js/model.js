import { API_URL, API_KEY } from './config.js';
import { AJAX } from './helpers.js';
import { PAGE_RECIPES_MAX_AMOUNT } from './config.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    currentPage: 1,
    results: [],
    resultsPerPage: PAGE_RECIPES_MAX_AMOUNT,
  },
  bookMarks: localStorage.getItem('Bookmarks')
    ? JSON.parse(localStorage.getItem('Bookmarks'))
    : [],
  //bookMarks: [],
};
// bookMarks: localStorage.getItem('Bookmarks')? JSON.parse(localStorage.getItem('Bookmarks')): [],

const createRecipeObject = async function (data) {
  let { recipe } = await data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    // if recipe.key doesn't exist nothing will happen
    // if recipe.key exists it will be added
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = await createRecipeObject(data);

    state.recipe.bookmarked = state.bookMarks.some(el => el.id === id);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    alert(err);
  }
};

export const getSearchResultsPage = function (page) {
  let start = (page - 1) * PAGE_RECIPES_MAX_AMOUNT;
  let end = page * PAGE_RECIPES_MAX_AMOUNT;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (newServings * ing.quantity) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookMarks));
};
export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookMark = function (id) {
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Inputed ingredients format is not correct! Please, use correct one'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    let recipe = {
      cooking_time: +newRecipe.cookingTime,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      ingredients: ingredients,
      source_url: newRecipe.sourceUrl,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);

    state.recipe = await createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
