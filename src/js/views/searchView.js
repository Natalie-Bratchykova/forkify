class searchView {
  _parentElement = document.querySelector('.search');
  _searchBtn = document.querySelector('.search__btn');

  getQuery() {
    return this._parentElement.querySelector('.search__field').value;
  }
  clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });

    this._searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
