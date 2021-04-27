import SortView from '../view/sort.js';
import PointsListView from '../view/points-list.js';
import NoWaypointView from '../view/no-waypoints.js';
import WaypointPresenter from './waypoint.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render.js';
import {sortTime, sortPrice} from '../utils/waypoint.js';
import {SortType} from '../const.js';

export default class Trip {
  constructor(tripEvents) {
    this._tripEvents = tripEvents;
    this._waypointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._waypointListComponent = new PointsListView();
    this._noWaypointComponent = new NoWaypointView();

    this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(waypoints, EDIT_FORM) {
    this._waypoints = waypoints.slice();
    this._editForm = EDIT_FORM;
    this._sourcedWaypoints = waypoints.slice();

    render(this._tripEvents, this._waypointListComponent, RenderPosition.BEFOREEND);

    this._renderTrip();
  }

  _handleModeChange() {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleWaypointChange(updatedWaypoint) {
    this._waypoints = updateItem(this._waypoints, updatedWaypoint);
    this._sourcedWaypoints = updateItem(this._sourcedWaypoints, updatedWaypoint);
    this._waypointPresenter[updatedWaypoint.id].init(updatedWaypoint, this._editForm);
  }

  _sortWaypoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._waypoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this._waypoints.sort(sortPrice);
        break;
      default:
        this._waypoints = this._sourcedWaypoints.slice();
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortWaypoints(sortType);
    this._clearWaypointList();
    this._renderWaypoints();
  }

  _renderSort() {
    render(this._tripEvents, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderWaypoint(waypoint, EDIT_FORM) {
    const waypointPresenter = new WaypointPresenter(this._waypointListComponent, this._handleWaypointChange, this._handleModeChange);
    waypointPresenter.init(waypoint, EDIT_FORM);
    this._waypointPresenter[waypoint.id] = waypointPresenter;
  }

  _renderWaypoints() {
    this._waypoints.forEach((waypoint) => this._renderWaypoint(waypoint, this._editForm));
  }

  _renderNoWaypoints() {
    render(this._tripEvents, this._noWaypointComponent, RenderPosition.BEFOREEND);
  }

  _clearWaypointList() {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};
  }

  _renderTrip() {
    if (this._waypoints.length === 0) {
      this._renderNoWaypoints();
    }
    this._renderSort();
    this._renderWaypoints();
  }
}

