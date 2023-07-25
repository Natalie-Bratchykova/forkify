import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    const markUp = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    //return this.renderError();
    const newMarkUp = this._generateMarkup();

    this._data = data;
    // create "virtual" DOM
    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // console.log(newElements);
    // // console.log(currentElements);

    newElements.forEach((ne, i) => {
      if (
        !ne.isEqualNode(currentElements[i]) &&
        ne.firstChild?.nodeValue.trim() != ''
      ) {
        currentElements[i].textContent = ne.textContent;
      }

      if (!ne.isEqualNode(currentElements[i])) {
        Array.from(ne.attributes).forEach(attr => {
          currentElements[i].setAttribute(attr.name, attr.value);
        });
      }
    });
    // this._clear();
    //this._parentElement.insertAdjacentHTML('afterbegin', newMarkUp);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    let markUp = `
         <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  renderError(message = this._errorMessage) {
    const markUp = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this._message) {
    const markUp = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
