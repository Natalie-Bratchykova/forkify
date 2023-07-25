import View from './View.js';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _errorMessage = `Your recipe wasn't added:(`;
  _message = 'Your recipe was successfully uploaded';

  constructor() {
    super();
    this.addHandlerOpenWindow();
    this.addHandlerCloseWindow();
    this.addHandlerUpload();
  }
  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      // FormData(FormElement)
      let data = [...new FormData(this)];
      let btn = e.target.closest('.upload__btn');
      if (!btn) return;
      // from array to object
      let dataObj = Object.fromEntries(data);
      handler(dataObj);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
