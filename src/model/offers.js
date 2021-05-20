import Observer from '../utils/observer.js';
import {nanoid} from 'nanoid';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(updateType, offers) {
    this._offers = offers.slice();
    this._notify(updateType);
  }

  getOffers() {
    return this._offers;
  }

  updateOffer(updateType, update) {
    const index = this._offers.findIndex((offer) => offer.type === update.type);

    if (index === -1) {
      throw new Error('Can\'t update unexisting offer');
    }

    this._offers = [
      ...this._offers.slice(0, index),
      update,
      ...this._offers.slice(index + 1),
    ];

    this._notify(updateType, update);
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
