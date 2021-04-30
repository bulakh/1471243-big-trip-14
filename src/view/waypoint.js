import AbstractView from './abstract.js';
import {dayOfStartEvent, timeStart, timeEnd} from '../utils/waypoint.js';

const createWaypointTemplate = (waypoint = {}) => {
  const {basePrice, dateFrom, dateTo, durationTime, type, Offer, destination, isFavorite} = waypoint;

  const renderOffers = (Offer) => {
    const eventOffers = Offer.offers;
    const offerItems = new Array;
    for (const eventOffer of eventOffers) {
      const map = new Map(Object.entries(eventOffer));
      const title = map.get('title');
      const price = map.get('price');
      const isChecked = map.get('isChecked');

      const offerItem = `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;

      if (isChecked === true) {
        offerItems.push(offerItem);
      }
    }
    return offerItems.join(' ');
  };

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${dayOfStartEvent(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${timeStart(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${timeEnd(dateTo)}</time>
        </p>
        <p class="event__duration">${durationTime}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
       ${renderOffers(Offer)}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Waypoint extends AbstractView {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
