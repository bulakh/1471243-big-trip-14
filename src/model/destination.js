import Observer from '../utils/observer.js';

export default class Destination extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  updateDestination(updateType, update) {
    const index = this._destinations.findIndex((destination) => destination.name === update.name);

    if (index === -1) {
      throw new Error('Can\'t update unexisting destination');
    }

    this._destinations = [
      ...this._destinations.slice(0, index),
      update,
      ...this._destinations.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
