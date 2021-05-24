import SortView from '../view/sort.js';
import WaypointsListView from '../view/waypoints-list.js';
import NoWaypointView from '../view/no-waypoints.js';
import InformationRoutView from '../view/information-rout.js';
import WaypointPresenter, {State as WaypointPresenterViewState} from './waypoint.js';
import WaypointNewPresenter from './waypoint-new.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {sortTime, sortPrice, sortDate} from '../utils/waypoint.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction} from '../const.js';

export default class Trip {
  constructor(
    tripContainer,
    informationContainer,
    waypointsModel,
    filterModel,
    offersModel,
    destinationsModel,
    EDIT_FORM,
    buttonNewEvent,
    loadingEvent,
    api) {
    this._waypointsModel = waypointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._informationContainer = informationContainer;
    this._waypointPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._editForm = EDIT_FORM;
    this._sortComponent = null;
    this._informationRoutComponent = null;
    this._buttonNewEvent = buttonNewEvent;
    this._isLoading = true;
    this._api = api;

    this._waypointListComponent = new WaypointsListView();
    this._noWaypointComponent = new NoWaypointView();
    this._informationRoutComponent = new InformationRoutView(this._waypointsModel, this._offersModel);
    this._loadingComponent = loadingEvent;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._waypointNewPresenter = new WaypointNewPresenter(this._waypointListComponent, this._handleViewAction, this._offersModel, this._destinationsModel, this._buttonNewEvent);
  }

  init() {
    render(this._tripContainer, this._waypointListComponent, RenderPosition.BEFOREEND);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true, destroyInformation: false});

    remove(this._waypointListComponent);
    remove(this._sortComponent);
    remove(this._noWaypointComponent);

    this._waypointsModel.removeObserver(this._handleModelEvent);
    this._destinationsModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createWaypoint() {
    this._waypointNewPresenter.init();
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();
    const filtredWaypoints = filter[filterType](waypoints);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredWaypoints.sort(sortTime);
      case SortType.PRICE:
        return filtredWaypoints.sort(sortPrice);
    }
    return filtredWaypoints.sort(sortDate);
  }

  _handleModeChange() {
    this._waypointNewPresenter.destroy();
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    const allOffers = this._offersModel.getOffers();
    const allDestinations = this._destinationsModel.getDestinations();

    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._waypointPresenter[update.id].setViewState(WaypointPresenterViewState.SAVING);
        this._api.updateWaypoint(update, allOffers, allDestinations)
          .then((response) => {
            this._waypointsModel.updateWaypoint(updateType, response);
          })
          .catch(() => {
            this._waypointPresenter[update.id].setViewState(WaypointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_WAYPOINT:
        this._waypointNewPresenter.setSaving();
        this._api.addWaypoint(update, allOffers, allDestinations)
          .then((response) => {
            this._waypointsModel.addWaypoint(updateType, response);
          })
          .catch(() => {
            this._waypointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_WAYPOINT:
        this._waypointPresenter[update.id].setViewState(WaypointPresenterViewState.DELETING);
        this._api.deleteWaypoint(update)
          .then(() => {
            this._waypointsModel.deleteWaypoint(updateType, update);
          })
          .catch(() => {
            this._waypointPresenter[update.id].setViewState(WaypointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._waypointPresenter[data.id].init(data, this._editForm);
        remove(this._informationRoutComponent);
        this._renderInformationRout();
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        remove(this._noWaypointComponent);
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._waypointListComponent, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);
    waypointPresenter.init(waypoint, this._editForm);
    this._waypointPresenter[waypoint.id] = waypointPresenter;
  }

  _renderWaypoints() {
    this._getWaypoints().forEach((waypoint) => this._renderWaypoint(waypoint, this._editForm));
  }

  _renderNoWaypoints() {
    render(this._tripContainer, this._noWaypointComponent, RenderPosition.BEFOREEND);
  }

  _renderInformationRout() {
    render(this._informationContainer, this._informationRoutComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip({resetSortType = false, destroyInformation = true} = {}) {
    this._waypointNewPresenter.destroy();
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};

    remove(this._noWaypointComponent);
    remove(this._sortComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    if (destroyInformation){
      remove(this._informationRoutComponent);
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    if (this._getWaypoints().length === 0) {
      this._renderNoWaypoints();
      return;
    }

    this._renderInformationRout();
    this._renderSort();
    this._renderWaypoints();
  }
}

