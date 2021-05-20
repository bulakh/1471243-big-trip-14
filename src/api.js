import WaypointsModel from './model/waypoints.js';
import OffersModel from './model/offers.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getAllDataFromServer() {
    return Promise.all([this.getWaypointsWithoutAdapt(), this.getOffers(), this.getDestiantions()])
      .then((result) => {
        const [waypointsData, offeresData, destionationData] = result;
        return [
          waypointsData.map((waypoint) => WaypointsModel.adaptToClient(waypoint, offeresData)),
          offeresData,
          destionationData,
        ];
      });
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(Api.toJSON)
      .then((offers) => offers.map(OffersModel.adaptToClient));
  }

  getDestiantions() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }

  getWaypointsWithoutAdapt() {
    return this._load({url: 'points'})
      .then(Api.toJSON);
  }

  updateWaypoint(waypoint, allOffers, allDestinations) {
    return this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(WaypointsModel.adaptToServer(waypoint, allOffers, allDestinations)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((result) => WaypointsModel.adaptToClient(result, allOffers));
  }

  addWaypoint(waypoint, allOffers, allDestinations) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(WaypointsModel.adaptToServer(waypoint, allOffers, allDestinations)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      // .then(console.log)
      .then((result) => WaypointsModel.adaptToClient(result, allOffers));
  }

  deleteWaypoint(waypoint) {
    return this._load({
      url: `points/${waypoint.id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}


