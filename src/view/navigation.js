import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createNavigationTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-name='${MenuItem.TABLE}'>Table</a>
    <a class="trip-tabs__btn" href="#" data-name='${MenuItem.STATS}'>Stats</a>
  </nav>`;
};

export default class Navigation extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.name);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  addClassItem(menuItem) {
    this.getElement().querySelector(`[data-name=${menuItem}]`).classList.add('trip-tabs__btn--active');
  }

  removeClassItem(menuItem) {
    this.getElement().querySelector(`[data-name=${menuItem}]`).classList.remove('trip-tabs__btn--active');
  }
}
