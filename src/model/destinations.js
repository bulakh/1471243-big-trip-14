import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  set(updateType, destinations) {
    this._destinations = destinations.slice();
    this._notify(updateType);
  }

  get() {
    return this._destinations;
  }
}
