import Observer from '../utils/observer.js';
import {createDurationTime, getOfferIds, getOffersOnId, getDestination} from '../utils/waypoint.js';

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  setWaypoints(updateType, waypoints) {
    this._waypoints = waypoints.slice();
    this._notify(updateType);
  }

  getWaypoints() {
    return this._waypoints;
  }

  updateWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      update,
      ...this._waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this._waypoints = [
      update,
      ...this._waypoints,
    ];

    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      ...this._waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(waypoint, allOffers) {
    const adaptedWaypoint = Object.assign(
      {},
      waypoint,
      {
        destination: waypoint.destination.name,
        basePrice: waypoint.base_price,
        dateFrom: new Date(waypoint.date_from),
        dateTo: new Date(waypoint.date_to),
        durationTime: createDurationTime(waypoint.date_from, waypoint.date_to),
        isFavorite: waypoint.is_favorite,
        offerIds: getOfferIds(waypoint.type, waypoint.offers, allOffers),
      },
    );

    delete adaptedWaypoint.base_price;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.offers;
    delete adaptedWaypoint.is_favorite;

    return adaptedWaypoint;
  }

  static adaptToServer(waypoint, allOffers, allDestinations) {
    const adaptedWaypoint = Object.assign(
      {},
      waypoint,
      {
        'base_price': waypoint.basePrice,
        'date_from': waypoint.dateFrom.toISOString(),
        'date_to': waypoint.dateTo.toISOString(),
        'is_favorite': waypoint.isFavorite,
        'offers': getOffersOnId(waypoint.type, waypoint.offerIds, allOffers),
        'destination': getDestination(waypoint.destination, allDestinations),
      },
    );

    delete adaptedWaypoint.basePrice;
    delete adaptedWaypoint.dateFrom;
    delete adaptedWaypoint.dateTo;
    delete adaptedWaypoint.isFavorite;
    delete adaptedWaypoint.durationTime;
    delete adaptedWaypoint.offerIds;

    return adaptedWaypoint;
  }
}
