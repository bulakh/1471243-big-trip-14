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
import {render, RenderPosition, replace} from './utils/render.js';

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
    replace(waypointEditFormComponent, waypointComponent);
  };

  const replaceFormToCard = () => {
    replace(waypointComponent, waypointEditFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  waypointComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  waypointEditFormComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(waypointListElement, waypointComponent, RenderPosition.BEFOREEND);
};


const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
render(tripNavigationElement, new NavigationView(), RenderPosition.BEFOREEND);
render(tripFiltersElement, new FiltersView(), RenderPosition.BEFOREEND);
render(tripMainElement, new InformationRoutView(informationOfRout), RenderPosition.AFTERBEGIN);


const tripEventsElement = document.querySelector('.trip-events');
if (waypoints.length === 0) {
  render(tripEventsElement, new NoWaypointView(), RenderPosition.BEFOREEND);
}

render(tripEventsElement, new PointsListView(), RenderPosition.BEFOREEND);
const tripPointsList = tripEventsElement.querySelector('.trip-events__list');
render(tripEventsElement, new SortView(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < WAYPOINT_COUNT; i++) {
  renderWaypoint(tripPointsList, waypoints[i], EDIT_FORM);
}

