import {TYPES, DESTINATIONS} from '../const.js';
import {timeStartOpenCard, timeEndOpenCard} from '../util.js';
import {toggleEditCancelButton, renderRollupButton} from './form-edit';


export const createFormEventTemplate = (waypoint = {}, editTemplate) => {

  const {
    type = 'flight',
    destination = 'Berlin',
    basePrice = '',
    dateFrom = '',
    dateTo = '',
    durationTime = '',
    isFavorite = false,
    id = '',
    Offer = {
      type: 'flight',
      offers: '',
    },
    DestinationInformation = {
      description: '',
      name: 'Berlin',
      pictures: '',
    }} = waypoint;

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

  const createTypeEvent = (currentType) => {
    return TYPES.map((type) => `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
      ${currentType === type ? 'checked' : ''}/>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type[0].toUpperCase() + type.slice(1)}</label>
    </div>`).join('');
  };

  const createNameDestination = () => {
    return DESTINATIONS.map((destination) => `<option value="${destination}"></option>`).join('');
  };

  const createOffer = (offers) => {
    const offerItems = new Array;
    let idOffer = 0;
    for (const offer of offers) {
      const map = new Map(Object.entries(offer));
      const title = map.get('title');
      const price = map.get('price');
      const checked = map.get('checked');
      idOffer++;

      const offerItem = `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${idOffer}" type="checkbox" name="event-offer-${type}" ${checked ? 'checked' : ''}>
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

  const typeTemplate = createTypeEvent(type);
  const destinationTemplate = createNameDestination();
  const timeStart = timeStartOpenCard(dateFrom);
  const timeEnd = timeEndOpenCard(dateTo);

  const editTemplateCancel = toggleEditCancelButton(editTemplate);
  const editRollupButton = renderRollupButton(editTemplate);

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
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffer(Offer.offers)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${DestinationInformation.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${renderPictures(DestinationInformation)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
};
