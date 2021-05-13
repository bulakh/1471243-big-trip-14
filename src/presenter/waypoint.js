import FormWaipointView from '../view/form.js';
import WaypointView from '../view/waypoint.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {isDatesEqual} from '../utils/waypoint.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Waypoint {
  constructor (waypointContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._waypointContainer = waypointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._waypointComponent = null;
    this._waypointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCardToBack = this._handleCardToBack.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(waypoint, EDIT_FORM) {
    this._waypoint = waypoint;
    this._editForm = EDIT_FORM;

    const prevWaypointComponent = this._waypointComponent;
    const prevWaypointEditFormComponent = this._waypointEditFormComponent;

    this._waypointComponent = new WaypointView(waypoint, this._offersModel);
    this._waypointEditFormComponent = new FormWaipointView(waypoint, this._offersModel, this._destinationsModel, EDIT_FORM);

    this._waypointComponent.setEditClickHandler(this._handleEditClick);
    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._waypointEditFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditFormComponent.setCardtoBackHandler(this._handleCardToBack);
    this._waypointEditFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevWaypointComponent === null || prevWaypointEditFormComponent === null) {
      render(this._waypointContainer, this._waypointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._waypointEditFormComponent, prevWaypointEditFormComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditFormComponent);
  }

  destroy() {
    remove(this._waypointComponent);
    remove(this._waypointEditFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._waypointEditFormComponent, this._waypointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._waypointComponent, this._waypointEditFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._waypointEditFormComponent.reset(this._waypoint);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleCardToBack() {
    this._waypointEditFormComponent.reset(this._waypoint);
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._waypoint,
        {
          isFavorite: !this._waypoint.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(update) {
    const isMinorUpdate = !isDatesEqual(this._waypoint.dateFrom, update.dateFrom);

    this._changeData(
      UserAction.UPDATE_WAYPOINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this._replaceFormToCard();
  }

  _handleDeleteClick(waypoint) {
    this._changeData(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  }
}
