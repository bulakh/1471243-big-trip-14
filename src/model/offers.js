import Observer from '../utils/observer.js';
import {nanoid} from 'nanoid';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  set(updateType, offers) {
    this._offers = offers.slice();
    this._notify(updateType);
  }

  get() {
    return this._offers;
  }

  static adaptToClient(data) {
    const adaptedOffers = data.offers.slice();

    adaptedOffers.map((currentOffer) =>{
      currentOffer.id = nanoid();
      return currentOffer;
    });

    return Object.assign({}, data, {offers: adaptedOffers});
  }
}
