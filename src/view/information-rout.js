import AbstractView from './abstract.js';
import {sortDate, getTimeStartHeader, getTimeEndHeader, checkPrice} from '../utils/waypoint.js';
import {findDueOffer} from '../utils/common.js';

const getSumCost = (waypoints, offersModel) => {
  let priceCount = 0;
  for (const waypoint of waypoints) {
    const map = new Map(Object.entries(waypoint));
    const price = map.get('basePrice');
    const offerIds = map.get('offerIds');
    priceCount+= price;

    const dueOffer = findDueOffer(offersModel.get(), waypoint.type);

    const offers = dueOffer.offers;
    for (const offer of offers) {
      const mapOffer = new Map(Object.entries(offer));
      const id = mapOffer.get('id');
      const priceOffer = mapOffer.get('price');
      offerIds.map((offerId) => {
        if (offerId === id) {
          priceCount+= priceOffer;
        }
      });
    }
  }
  return priceCount;
};

const createInformationRoutTemplate = (waypoints, offersModel) => {
  const COUNT_DESTINATIONS = 3;

  const sortedWaypoints = waypoints.sort(sortDate);

  const firstDestination = sortedWaypoints[0].destination;
  const secondDestination = sortedWaypoints.length === COUNT_DESTINATIONS ? sortedWaypoints[1].destination : '...';
  const lastDestination = sortedWaypoints[sortedWaypoints.length - 1].destination;
  const startDay = getTimeStartHeader(sortedWaypoints[0].dateFrom);
  const lastDay = getTimeEndHeader(sortedWaypoints[sortedWaypoints.length - 1].dateFrom);
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
    return createInformationRoutTemplate(this._waypointsModel.get(), this._offersModel);
  }
}
