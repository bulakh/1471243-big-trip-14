import AbstractView from './abstract.js';
import {sortDate, timeStartHeader, timeEndHeader, checkPrice} from '../utils/waypoint.js';
import {findDueOffer} from '../utils/common.js';

const getSumCost = (waypoints, offersModel) => {
  let priceCount = 0;
  for (const waypoint of waypoints) {
    const map = new Map(Object.entries(waypoint));
    const price = map.get('basePrice');
    priceCount+= Number(price);

    const dueOffer = findDueOffer(offersModel.getOffers(), waypoint.type);

    const offers = dueOffer.offers;
    for (const offer of offers) {
      const mapOffer = new Map(Object.entries(offer));
      const isChecked = mapOffer.get('isChecked');
      const priceOffer = mapOffer.get('price');
      if (isChecked) {
        priceCount+= Number(priceOffer);
      }
    }
  }
  return priceCount;
};

const createInformationRoutTemplate = (waypoints, offersModel) => {
  const sortedWaypoints = waypoints.sort(sortDate);

  const firstDestination = sortedWaypoints[0].destination;
  const secondDestination = sortedWaypoints.length === 3 ? sortedWaypoints[1].destination : '...';
  const lastDestination = sortedWaypoints[sortedWaypoints.length - 1].destination;
  const startDay = timeStartHeader(sortedWaypoints[0].dateFrom);
  const lastDay = timeEndHeader(sortedWaypoints[sortedWaypoints.length - 1].dateFrom);
  const sumOfCosts = getSumCost(waypoints, offersModel);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${firstDestination} &mdash; ${secondDestination} &mdash; ${lastDestination}</h1>

      <p class="trip-info__dates">${startDay}&nbsp;&mdash;&nbsp;${lastDay}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${checkPrice(sumOfCosts)}</span>
    </p>
  </section>`;
};

export default class InformationRout extends AbstractView {
  constructor(waypointsModel, offersModel) {
    super();
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
  }

  getTemplate() {
    return createInformationRoutTemplate(this._waypointsModel.getWaypoints(), this._offersModel);
  }
}
