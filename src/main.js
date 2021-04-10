import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createFormEventTemplate} from './view/form.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createFiltersTemplate} from './view/filters.js';
import {createInformationRoutTemplate} from './view/information-rout.js';
import {createCostRoutTemplate} from './view/cost-rout.js';
import {generateWaypoint} from './mock/waypoint.js';


const WAYPOINT_COUNT = 20;
const editTemplate = true;

const waypoints = new Array(WAYPOINT_COUNT).fill().map(generateWaypoint);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripEventsElement = document.querySelector('.trip-events');
render(tripEventsElement, createSortTemplate(), 'beforeend');
render(tripEventsElement, createPointsListTemplate(), 'beforeend');

const tripPointsList = tripEventsElement.querySelector('.trip-events__list');
render(tripPointsList, createFormEventTemplate(waypoints[0], editTemplate), 'afterbegin');

for (let i = 1; i < WAYPOINT_COUNT; i++) {
  render(tripPointsList, createWaypointTemplate(waypoints[i]), 'beforeend');
}

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

render(tripNavigationElement, createNavigationTemplate(), 'beforeend');
render(tripFiltersElement, createFiltersTemplate(), 'beforeend');

const tripInfoElement = tripMainElement.querySelector('.trip-main__trip-info');


render(tripMainElement, createInformationRoutTemplate(waypoints), 'afterbegin');
render(tripInfoElement, createCostRoutTemplate(), 'beforeend');


