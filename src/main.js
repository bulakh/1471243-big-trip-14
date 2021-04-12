import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import FormWaipointView from './view/form.js';
import WaypointView from './view/waypoint.js';
import NavigationView from './view/navigation.js';
import FiltersView from './view/filters.js';
import InformationRoutView from './view/information-rout.js';
import {generateWaypoint} from './mock/waypoint.js';
import {generateInformationOfRout} from './mock/information-rout.js';
import {render, RenderPosition} from './utils.js';

const WAYPOINT_COUNT = 3;
const editForm = true;

const waypoints = new Array(WAYPOINT_COUNT).fill().map(generateWaypoint);
const informationOfRout = generateInformationOfRout(waypoints);

const renderWaypoint = (waypointListElement, waypoint, editForm) => {
  const waypointComponent = new WaypointView(waypoint);
  const waypointEditFormComponent = new FormWaipointView(waypoint, editForm);

  const replaceCardToForm = () => {
    waypointListElement.replaceChild(waypointEditFormComponent.getElement(), waypointComponent.getElement());
  };

  const replaceFormToCard = () => {
    waypointListElement.replaceChild(waypointComponent.getElement(), waypointEditFormComponent.getElement());
  };

  waypointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  waypointEditFormComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(waypointListElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};


const tripEventsElement = document.querySelector('.trip-events');
render(tripEventsElement, new PointsListView().getElement(), RenderPosition.BEFOREEND);
const tripPointsList = tripEventsElement.querySelector('.trip-events__list');
render(tripEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

renderWaypoint(tripPointsList, waypoints[0], editForm);

for (let i = 1; i < WAYPOINT_COUNT; i++) {
  renderWaypoint(tripPointsList, waypoints[i], editForm);
}

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
render(tripNavigationElement, new NavigationView().getElement(), RenderPosition.BEFOREEND);
render(tripFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripMainElement, new InformationRoutView(informationOfRout).getElement(), RenderPosition.AFTERBEGIN);

