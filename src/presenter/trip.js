import SortView from '../view/sort.js';
import PointsListView from '../view/points-list.js';
import NoWaypointView from '../view/no-waypoints.js';
import WaypointPresenter from './waypoint.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Trip {
  constructor(tripEvents) {
    this._tripEvents = tripEvents;
    this._waypointPresenter = {};

    this._sortComponent = new SortView();
    this._waypointListComponent = new PointsListView();
    this._noWaypointComponent = new NoWaypointView();

    this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(waypoints, EDIT_FORM) {
    this._waypoints = waypoints.slice();
    this._editForm = EDIT_FORM;

    render(this._tripEvents, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._tripEvents, this._waypointListComponent, RenderPosition.BEFOREEND);

    this._renderTrip(this._waypoints, this._editForm);
  }

  _handleModeChange() {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleWaypointChange(updatedWaypoint, EDIT_FORM) {
    this._waypoints = updateItem(this._waypoints, updatedWaypoint);
    this._waypointPresenter[updatedWaypoint.id].init(updatedWaypoint, EDIT_FORM);
  }

  _renderWaypoint(waypoint, EDIT_FORM) {
    const waypointPresenter = new WaypointPresenter(this._waypointListComponent, this._handleWaypointChange, this._handleModeChange);
    waypointPresenter.init(waypoint, EDIT_FORM);
    this._waypointPresenter[waypoint.id] = waypointPresenter;
  }

  _renderWaypoints(waypoints, EDIT_FORM) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint, EDIT_FORM));
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

  _renderTrip(waypoints, EDIT_FORM) {
    if (waypoints.length === 0) {
      this._renderNoWaypoints();
    }
    this._renderWaypoints(waypoints, EDIT_FORM);
  }
}

