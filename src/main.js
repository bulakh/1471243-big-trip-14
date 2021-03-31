import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createFormEditTemplate} from './view/form-edit.js';
import {createFormNewEventTemplate} from './view/form-new.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createFiltersTemplate} from './view/filters.js';
import {createInformationRoutTemplate} from './view/information-rout.js';
import {createCostRoutTemplate} from './view/cost-rout.js';

const TASK_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripEventsElement = document.querySelector('.trip-events');
render(tripEventsElement, createSortTemplate(), 'beforeend');
render(tripEventsElement, createPointsListTemplate(), 'beforeend');

const tripPointsList = tripEventsElement.querySelector('.trip-events__list');
render(tripPointsList, createFormEditTemplate(), 'afterbegin');
render(tripPointsList, createFormNewEventTemplate(), 'beforeend');

for (let i = 0; i < TASK_COUNT; i++) {
  render(tripPointsList, createWaypointTemplate(), 'beforeend');
}

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

render(tripNavigationElement, createNavigationTemplate(), 'beforeend');
render(tripFiltersElement, createFiltersTemplate(), 'beforeend');

const tripInfoElement = tripMainElement.querySelector('.trip-main__trip-info');


render(tripMainElement, createInformationRoutTemplate(), 'afterbegin');
render(tripInfoElement, createCostRoutTemplate(), 'beforeend');


