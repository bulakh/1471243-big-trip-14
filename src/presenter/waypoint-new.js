import FormWaipointView from '../view/form.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class WaypointNew {
  constructor(waypointsContainer, changeData, offersModel, destinationsModel,buttonNewEvent) {
    this._waypointsContainer = waypointsContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._destroyCallback = null;

    this._waypointEditComponent = null;
    this._buttonNewEvent = buttonNewEvent;

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

  setSaving() {
    this._waypointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._waypointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._waypointEditComponent.shake(resetFormState);
  }

  addDisabled() {
    this._buttonNewEvent.getElement().setAttribute('disabled', 'disabled');
  }

  removeDisabled() {
    this._buttonNewEvent.getElement().removeAttribute('disabled', 'disabled');
  }

  _handleFormSubmit(waypoint) {
    this._changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
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
