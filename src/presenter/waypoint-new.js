import FormWaipointView from '../view/form.js';
import {nanoid} from 'nanoid';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class WaypointNew {
  constructor(waypointsContainer, changeData, offersModel, destinationsModel) {
    this._waypointsContainer = waypointsContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._waypointEditComponent = null;
    this._buttonNewEvent = document.querySelector('.trip-main__event-add-btn');

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._waypointEditComponent !== null) {
      return;
    }

    this._waypointEditComponent = new FormWaipointView(undefined, this._offersModel, this._destinationsModel);
    this._waypointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._waypointsContainer, this._waypointEditComponent, RenderPosition.AFTERBEGIN);

    this.addDisabled();

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._waypointEditComponent === null) {
      return;
    }

    remove(this._waypointEditComponent);
    this._waypointEditComponent = null;

    this.removeDisabled();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  addDisabled() {
    this._buttonNewEvent.setAttribute('disabled', 'disabled');
  }

  removeDisabled() {
    this._buttonNewEvent.removeAttribute('disabled', 'disabled');
  }

  _handleFormSubmit(waypoint) {
    this._changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, waypoint),
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
