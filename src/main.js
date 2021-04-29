// import {generateWaypoint} from './mock/waypoint.js';
import TripHeaderPresenter from './presenter/trip-header.js';
import TripPesenter from './presenter/trip.js';
import {fillWaypoints} from './mock/fillWaipoints.js';

// const WAYPOINT_COUNT = 20;
const EDIT_FORM = true;

// const waypoints = new Array(WAYPOINT_COUNT).fill().map(generateWaypoint);
const waypoints = fillWaypoints;

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripHeaderPresenter = new TripHeaderPresenter(tripMainElement, tripNavigationElement, tripFiltersElement);
tripHeaderPresenter.init(waypoints);


const tripPresenter = new TripPesenter(tripEventsElement);
tripPresenter.init(waypoints, EDIT_FORM);

