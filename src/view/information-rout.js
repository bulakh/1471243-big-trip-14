import {sortDate, timeStart, timeEnd, getSumCost} from '../mock/information-rout.js';

export const createInformationRoutTemplate = (waypoints) => {
  const sortedWaypoints = sortDate(waypoints);

  const firstDestination = sortedWaypoints[0].destination;
  const secondDestination = sortedWaypoints.length === 3 ? sortedWaypoints[1].destination : '...';
  const lastDestination = sortedWaypoints[sortedWaypoints.length - 1].destination;
  const startDay = timeStart(sortedWaypoints[0].dateFrom);
  const lastDay = timeEnd(sortedWaypoints[sortedWaypoints.length - 1].dateFrom);
  const sumOfCosts = getSumCost(waypoints);

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
