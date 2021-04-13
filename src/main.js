import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import FormWaipointView from './view/form.js';
import WaypointView from './view/waypoint.js';
import NavigationView from './view/navigation.js';
import FiltersView from './view/filters.js';
import InformationRoutView from './view/information-rout.js';
import NoWaypointView from './view/no-waypoints.js';
import {generateWaypoint} from './mock/waypoint.js';
import {generateInformationOfRout, generateEmptyInformation} from './mock/information-rout.js';
import {render, RenderPosition} from './utils.js';

const WAYPOINT_COUNT = 5;
const EDIT_FORM = true;
let informationOfRout;

const waypoints = new Array(WAYPOINT_COUNT).fill().map(generateWaypoint);
if (waypoints.length === 0) {
  informationOfRout = generateEmptyInformation();
} else {
  informationOfRout = generateInformationOfRout(waypoints);
}

const renderWaypoint = (waypointListElement, waypoint, EDIT_FORM) => {
  const waypointComponent = new WaypointView(waypoint);
  const waypointEditFormComponent = new FormWaipointView(waypoint, EDIT_FORM);

  const replaceCardToForm = () => {
    waypointListElement.replaceChild(waypointEditFormComponent.getElement(), waypointComponent.getElement());
  };

  const replaceFormToCard = () => {
    waypointListElement.replaceChild(waypointComponent.getElement(), waypointEditFormComponent.getElement());
  };

  const buttonOpen = waypointComponent.getElement().querySelector('.event__rollup-btn');
  const buttonClose = waypointEditFormComponent.getElement().querySelector('.event__rollup-btn');

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onClickOpenForm = () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
    buttonClose.addEventListener('click', onClickCloseForm);
  };

  const onClickCloseForm = () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  buttonOpen.addEventListener('click', onClickOpenForm);

  waypointEditFormComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(waypointListElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};


const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
render(tripNavigationElement, new NavigationView().getElement(), RenderPosition.BEFOREEND);
render(tripFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripMainElement, new InformationRoutView(informationOfRout).getElement(), RenderPosition.AFTERBEGIN);


const tripEventsElement = document.querySelector('.trip-events');
if (waypoints.length === 0) {
  render(tripEventsElement, new NoWaypointView().getElement(), RenderPosition.BEFOREEND);
}

render(tripEventsElement, new PointsListView().getElement(), RenderPosition.BEFOREEND);
const tripPointsList = tripEventsElement.querySelector('.trip-events__list');
render(tripEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < WAYPOINT_COUNT; i++) {
  renderWaypoint(tripPointsList, waypoints[i], EDIT_FORM);
}

