import {createElement} from '../utils.js';

const createInformationRoutTemplate = (routInfo) => {
  const {firstDestination, secondDestination, lastDestination, startDay, lastDay,sumOfCosts} = routInfo;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${firstDestination} &mdash; ${secondDestination} &mdash; ${lastDestination}</h1>

      <p class="trip-info__dates">${startDay}&nbsp;&mdash;&nbsp;${lastDay}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sumOfCosts}</span>
    </p>
  </section>`;
};

export default class InformationRout {
  constructor(routInfo) {
    this._routInfo = routInfo;
    this._element = null;
  }

  getTemplate() {
    return createInformationRoutTemplate(this._routInfo);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
