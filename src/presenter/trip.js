import SortView from '../view/sort.js';
import PointsListView from '../view/points-list.js';
import NoWaypointView from '../view/no-waypoints.js';
import InformationRoutView from '../view/information-rout.js';
import WaypointPresenter from './waypoint.js';
import WaypointNewPresenter from './waypoint-new.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {sortTime, sortPrice, sortDate} from '../utils/waypoint.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

export default class Trip {
  constructor(tripContainer, informationContainer, waypointsModel, filterModel, offersModel, destinationsModel, EDIT_FORM) {
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

    this._waypointListComponent = new PointsListView();
    this._noWaypointComponent = new NoWaypointView();
    this._informationRoutComponent = new InformationRoutView(this._waypointsModel, this._offersModel);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._waypointNewPresenter = new WaypointNewPresenter(this._waypointListComponent, this._handleViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    render(this._tripContainer, this._waypointListComponent, RenderPosition.BEFOREEND);

    this._renderTrip();
  }

  createTask() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
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
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this._waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this._waypointsModel.deleteWaypoint(updateType, update);
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

  _clearTrip({resetSortType = false} = {}) {
    this._waypointNewPresenter.destroy();

    remove(this._informationRoutComponent);
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};

    remove(this._sortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._getWaypoints().length === 0) {
      return this._renderNoWaypoints();
    }

    this._renderInformationRout();
    this._renderSort();
    this._renderWaypoints();
  }
}

