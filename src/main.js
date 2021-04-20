import NavigationView from './view/navigation.js';
import FiltersView from './view/filters.js';
import InformationRoutView from './view/information-rout.js';
import {generateWaypoint} from './mock/waypoint.js';
import {generateInformationOfRout, generateEmptyInformation} from './mock/information-rout.js';
import TripPesenter from './presenter/trip.js';
import {render, RenderPosition} from './utils/render.js';

const WAYPOINT_COUNT = 6;
const EDIT_FORM = true;
let informationOfRout;


const waypoints = new Array(WAYPOINT_COUNT).fill().map(generateWaypoint);
if (waypoints.length === 0) {
  informationOfRout = generateEmptyInformation();
} else {
  informationOfRout = generateInformationOfRout(waypoints);
}

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
render(tripNavigationElement, new NavigationView(), RenderPosition.BEFOREEND);
render(tripFiltersElement, new FiltersView(), RenderPosition.BEFOREEND);
render(tripMainElement, new InformationRoutView(informationOfRout), RenderPosition.AFTERBEGIN);


const tripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPesenter(tripEventsElement);

tripPresenter.init(waypoints, EDIT_FORM);

