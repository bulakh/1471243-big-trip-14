import SmartView from './smart.js';
import {TYPES, DESTINATIONS, EMPTY_WAYPOINT} from '../const.js';
import {timeStartOpenCard, timeEndOpenCard} from '../utils/waypoint.js';

const renderPictures = (information) => {
  const pictures = information.pictures;
  const imgItems = new Array;
  for (const picture of pictures) {
    const map = new Map(Object.entries(picture));
    const src = map.get('src');
    const description = map.get('description');

    const imgItem = `<img class="event__photo" src="${src}" alt="${description}">`;
    imgItems.push(imgItem);
  }
  return imgItems.join('');
};

const createTypeEvent = (currentType, id) => {
  return TYPES.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
    ${currentType === type ? 'checked' : ''}/>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type[0].toUpperCase() + type.slice(1)}</label>
  </div>`).join('');
};

const createNameDestination = () => {
  return DESTINATIONS.map((destination) => `<option value="${destination}"></option>`).join('');
};

const createOffer = (offers, type) => {
  const offerItems = new Array;
  for (const offer of offers) {
    const map = new Map(Object.entries(offer));
    const title = map.get('title');
    const price = map.get('price');
    const isChecked = map.get('isChecked');
    const idOffer = map.get('id');

    const offerItem = `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${idOffer}" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-${idOffer}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
    offerItems.push(offerItem);
  }
  return offerItems.join('');
};

const toggleEditCancelButton = (edit) => {
  return edit
    ? 'Delete'
    : 'Cancel';
};

const renderRollupButton = (edit) => {
  return edit
    ? `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
    : '';
};

const createSectionDestination = (isDestination, DestinationInformation, pictures) => {
  return isDestination
    ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${DestinationInformation.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures}
        </div>
      </div>
    </section>`
    : '';
};

const createSectionOffer = (isOffer, offers) => {
  return isOffer
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers}
      </div>
    </section>`
    : '';
};

const createFormEventTemplate = (data, editForm) => {

  const {type, id, destination, basePrice, dateFrom, dateTo, Offer, DestinationInformation, isOffer, isDestination} = data;

  const typeTemplate = createTypeEvent(type, id);
  const destinationTemplate = createNameDestination();
  const timeStart = timeStartOpenCard(dateFrom);
  const timeEnd = timeEndOpenCard(dateTo);

  const editTemplateCancel = toggleEditCancelButton(editForm);
  const editRollupButton = renderRollupButton(editForm);

  const offers = createOffer(Offer.offers, type);
  const pictures = renderPictures(DestinationInformation);

  const sectionOffer = createSectionOffer(isOffer, offers);
  const sectionDestination = createSectionDestination(isDestination, DestinationInformation, pictures);


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typeTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${destinationTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${timeStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${timeEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${editTemplateCancel}</button>
        ${editRollupButton}
      </header>
      <section class="event__details">
        ${sectionOffer}

        ${sectionDestination}
      </section>
    </form>
  </li>`;
};

export default class FormWaipoint extends SmartView {
  constructor(waypoint = EMPTY_WAYPOINT, EDIT_FORM, allWaypoints) {
    super();
    this._data = FormWaipoint.parseWaypointToData(waypoint);
    this._editForm = EDIT_FORM;
    this._allWaypoints = allWaypoints;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._backToCardClickHandler = this._backToCardClickHandler.bind(this);

    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFormEventTemplate(this._data, this._editForm);
  }

  reset(waypoint) {
    this.updateData(
      FormWaipoint.parseWaypointToData(waypoint),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCardtoBackHandler(this._callback.backClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._offersChangeHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('input', this._destinationInputHandler);
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeChangeHandler);
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const findDestinationWaypointHandler = (elem) => {
      if (elem.destination === evt.target.value) {
        return elem.DestinationInformation;
      }
    };

    const findedDestinationWaypoint = this._allWaypoints.find(findDestinationWaypointHandler);

    this.updateData({
      DestinationInformation: Object.assign(
        {},
        this._data.DestinationInformation,
        {
          name: evt.target.value,
          description: findedDestinationWaypoint ? findedDestinationWaypoint.DestinationInformation.description : '',
          pictures: findedDestinationWaypoint ? findedDestinationWaypoint.DestinationInformation.pictures : [],
        },
      ),
      isDestination: findedDestinationWaypoint,
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    const findTypeWaypointHandler = (elem) => {
      if (elem.type === evt.target.value) {
        return elem.Offer;
      }
    };

    const findedTypeWaypoint = this._allWaypoints.find(findTypeWaypointHandler);

    this.updateData({
      Offer: Object.assign(
        {},
        this._data.Offer,
        {
          type: evt.target.value,
          offers: findedTypeWaypoint ? findedTypeWaypoint.Offer.offers : [],
        },
      ),
      isOffer: findedTypeWaypoint ? findedTypeWaypoint.Offer.offers.length !== 0 : false,
    });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  _backToCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.backClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(FormWaipoint.parseDataToWaypoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setCardtoBackHandler(callback) {
    this._callback.backClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._backToCardClickHandler);
  }

  static parseWaypointToData(waypoint) {
    return Object.assign(
      {},
      waypoint,
      {
        isOffer: waypoint.Offer.offers.length !== 0,
        isDestination: waypoint.destination.trim() !== String(),
      },
    );
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    delete data.isOffer;
    delete data.isDestination;

    return data;
  }
}
