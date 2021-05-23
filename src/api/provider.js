import WaypointsModel from '../model/waypoints.js';
import {isOnline} from '../utils/common.js';

const getSyncedWaypoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.waypoint);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;

    this.KEY_DESTINATIONS = 'destinations';
    this.KEY_OFFERS = 'offers';
  }

  getAllDataFromServer() {
    if (isOnline()) {
      return this._api.getAllDataFromServer()
        .then((data) => {
          const [waypointsData, offersData, destionationData] = data;
          console.log('proveiderData', data);
          const itemsWaypoint = createStoreStructure(waypointsData.map((waypoint) => WaypointsModel.adaptToServer(waypoint, offersData, destionationData)));

          this._store.setItems(itemsWaypoint);
          this._store.setItem(this.KEY_DESTINATIONS, destionationData);
          this._store.setItem(this.KEY_OFFERS, offersData);
          console.log('getItams',this._store.getItems());

          return data;
        });
    }

    const storeData = Object.values(this._store.getItems());
    const destinations = storeData[storeData.length-2];
    const offers = storeData[storeData.length-1];
    storeData.splice(storeData.length-2, 2);

    const adaptWaypoints = storeData.map((waypoint) => WaypointsModel.adaptToClient(waypoint, offers));

    const adaptData = [adaptWaypoints, offers, destinations];
    console.log('arrResolve', adaptData);

    return Promise.resolve(adaptData);
  }

  updateWaypoint(waypoint, allOffers, allDestinations) {
    if (isOnline()) {
      return this._api.updateWaypoint(waypoint, allOffers, allDestinations)
        .then((updateWaypoint) => {
          this._store.setItem(updateWaypoint.id, WaypointsModel.adaptToServer(updateWaypoint, allOffers, allDestinations));

          return updateWaypoint;
        });
    }

    this._store.setItem(waypoint.id, WaypointsModel.adaptToServer(Object.assign({}, waypoint), allOffers, allDestinations));

    return Promise.resolve(waypoint);
  }

  addWaypoint(waypoint, allOffers, allDestinations) {
    if (isOnline()) {
      return this._api.addWaypoint(waypoint, allOffers, allDestinations)
        .then((newWaypoint) => {
          this._store.setItem(newWaypoint.id, WaypointsModel.adaptToServer(newWaypoint, allOffers, allDestinations));

          return newWaypoint;
        });
    }

    return Promise.reject(new Error('Add waypoint failed'));
  }

  deleteWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.deleteWaypoint(waypoint)
        .then(() => this._store.removeItem(waypoint.id));
    }

    return Promise.reject(new Error('Delete waypoint failed'));
  }

  sync() {
    if (isOnline()) {
      this._store.removeItem(this.KEY_DESTINATIONS);
      this._store.removeItem(this.KEY_OFFERS);
      const storeWaypoints = Object.values(this._store.getItems());

      console.log('storeWaypoints', storeWaypoints);


      return this._api.sync(storeWaypoints)
        .then((response) => {
          const createdWaypoints = getSyncedWaypoints(response.created);
          const updatedWaypoints = getSyncedWaypoints(response.updated);

          const items = createStoreStructure([...createdWaypoints, ...updatedWaypoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
