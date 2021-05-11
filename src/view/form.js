import SmartView from './smart.js';
import {TYPES, EMPTY_WAYPOINT} from '../const.js';
import {timeStartOpenCard, timeEndOpenCard, generateDurationTime, checkPrice, getAllNameDestinations} from '../utils/waypoint.js';
import {findDueOffer, findDueDestination} from '../utils/common.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';

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

const createNameDestination = (destinationsModel) => {
  const allDestinations = getAllNameDestinations(destinationsModel);

  return allDestinations.map((destination) => `<option value="${destination}"></option>`).join('');
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
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${idOffer}"
      data-id="${idOffer}" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
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

const createSectionDestination = (DestinationInformation, pictures) => {
  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${DestinationInformation.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures}
        </div>
      </div>
    </section>`;
};

const createSectionOffer = (offers) => {
  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers}
      </div>
    </section>`;
};

const createFormEventTemplate = (data, editForm, destinationsModel) => {
  const {type, id, destination, basePrice, dateFrom, dateTo, isOffer, isDestination, isSubmitDisabled, Offer, DestinationInformation} = data;

  const typeTemplate = createTypeEvent(type, id);
  const destinationTemplate = createNameDestination(destinationsModel);
  const timeStart = timeStartOpenCard(dateFrom);
  const timeEnd = timeEndOpenCard(dateTo);

  const editTemplateCancel = toggleEditCancelButton(editForm);
  const editRollupButton = renderRollupButton(editForm);

  let sectionOffer;
  let sectionDestination;

  if(isOffer) {
    const offers = createOffer(Offer.offers, type);
    sectionOffer = createSectionOffer(offers);
  }

  if (isDestination) {
    const pictures = renderPictures(DestinationInformation);
    sectionDestination = createSectionDestination(DestinationInformation, pictures);
  }

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
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destination)}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${destinationTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time event__input--time-start" id="event-start-time-${id}" type="text" name="event-start-time" value="${timeStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time event__input--time-end" id="event-end-time-${id}" type="text" name="event-end-time" value="${timeEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${checkPrice(basePrice)}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
        <button class="event__reset-btn" type="reset">${editTemplateCancel}</button>
        ${editRollupButton}
      </header>
      <section class="event__details">
        ${isOffer ? sectionOffer : ''}
        ${isDestination ? sectionDestination : ''}
      </section>
    </form>
  </li>`;
};

export default class FormWaypoint extends SmartView {
  constructor(waypoint = EMPTY_WAYPOINT, offersModel, destinationsModel, EDIT_FORM) {
    super();

    this._dueOffer = findDueOffer(offersModel.getOffers(), waypoint.type);
    this._dueDestination = findDueDestination(destinationsModel.getDestinations(), waypoint.destination);

    this._data = FormWaypoint.parseWaypointToData(waypoint, this._dueOffer, this._dueDestination);
    this._editForm = EDIT_FORM;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;


    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._backToCardClickHandler = this._backToCardClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._offersToggleHandler = this._offersToggleHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._durationCountHandler = this._durationCountHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }


  getTemplate() {
    return createFormEventTemplate(this._data, this._editForm, this._destinationsModel);
  }

  reset(waypoint) {
    this.updateData(
      FormWaypoint.parseWaypointToData(waypoint, this._dueOffer, this._dueDestination),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCardtoBackHandler(this._callback.backClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatepicker();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeChangeHandler);
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._offersChangeHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('input', this._destinationInputHandler);
    if (this._data.isOffer) {
      this.getElement()
        .querySelector('.event__section--offers')
        .addEventListener('change', this._offersToggleHandler);
    }
    this.getElement()
      .querySelector('.event__field-group--time')
      .addEventListener('change', this._durationCountHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);
  }

  _setDatepicker() {
    this._datepickerStart = flatpickr(
      this.getElement().querySelector('.event__input--time-start'),
      {
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        enableTime: true,
        defaultDate: new Date(this._data.dateFrom),
        onChange: this._startDateChangeHandler,
      },
    );

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector('.event__input--time-end'),
      {
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        enableTime: true,
        defaultDate: new Date(this._data.dateTo),
        onChange: this._endDateChangeHandler,
      },
    );
  }

  _durationCountHandler(evt) {
    evt.preventDefault();
    this.updateData({
      durationTime: generateDurationTime(this._data.dateFrom, this._data.dateTo),
      isSubmitDisabled: dayjs(this._data.dateTo).diff(dayjs(this._data.dateFrom)) < 0,
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const findDestinationHandler = (elem) => {
      if (elem.name === evt.target.value) {
        return elem;
      }
    };

    const allDestinations = getAllNameDestinations(this._destinationsModel);

    const findedDestination = this._destinationsModel.getDestinations().find(findDestinationHandler);

    this.updateData({
      DestinationInformation: Object.assign(
        {},
        this._dueDestination,
        {
          name: evt.target.value,
          description: findedDestination ? findedDestination.description : '',
          pictures: findedDestination ? findedDestination.pictures : [],
        },
      ),
      isDestination: findedDestination,
      isSubmitDisabled: allDestinations.indexOf(evt.target.value) < 0,
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    const findTypeHandler = (elem) => {
      if (elem.type === evt.target.value) {
        return elem;
      }
    };

    const findedType = this._offersModel.getOffers().find(findTypeHandler);

    this.updateData({
      Offer: Object.assign(
        {},
        this._dueOffer,
        {
          type: evt.target.value,
          offers: findedType ? findedType.offers : [],
        },
      ),
      isOffer: findedType ? findedType.offers.length !== 0 : false,
    });
  }

  _offersToggleHandler(evt) {
    evt.preventDefault();

    this.updateData({
      Offer: Object.assign(
        {},
        this._dueOffer,
        {
          [evt.target.dataset.id]: this._dueOffer.offers.map((el) => {if (evt.target.dataset.id === el.id) {el.isChecked = !el.isChecked;}}),
        },
      ),
    }, true);
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  _priceChangeHandler(evt) {
    this.updateData({
      basePrice: evt.target.value,
    });
  }

  _backToCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.backClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(FormWaypoint.parseDataToWaypoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(FormWaypoint.parseDataToWaypoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setCardtoBackHandler(callback) {
    this._callback.backClick = callback;
    if (this._editForm) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._backToCardClickHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parseWaypointToData(waypoint, dueOffer, dueDestination) {
    return Object.assign(
      {},
      waypoint,
      {
        isOffer: dueOffer ? dueOffer.offers.length !== 0 : false,
        isDestination: dueDestination ? dueDestination !== '' : false,
        isSubmitDisabled: dayjs(waypoint.dateTo).diff(dayjs(waypoint.dateFrom)) < 0 || waypoint.destination === '',
        Offer: dueOffer,
        DestinationInformation: dueDestination,
      },
    );
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    delete data.isOffer;
    delete data.isDestination;
    delete data.isSubmitDisabled;

    return data;
  }
}
