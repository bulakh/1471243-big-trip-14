import {generateWaypoint} from './mock/waypoint.js';
import {allOffers} from './mock/offer.js';
import {allDestinations} from './mock/destination.js';
import TripPesenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import WaypointsModel from './model/waypoints.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destination.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition, remove} from './utils/render.js';
import NavigationView from './view/navigation.js';
import ButtonNewEventView from './view/button-new-event.js';
import StatisticsView from './view/statistics.js';
import {MenuItem, UpdateType, FilterType} from './const.js';


const WAYPOINT_COUNT = 1;
const EDIT_FORM = true;

const waypoints = new Array(WAYPOINT_COUNT).fill().map(generateWaypoint);

const waypointsModel = new WaypointsModel();
waypointsModel.setWaypoints(waypoints);

const offersModel = new OffersModel();
offersModel.setOffers(allOffers);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(allDestinations);

const filterModel = new FilterModel();

const navigationComponent = new NavigationView();
const buttonNewEventComponent = new ButtonNewEventView();

const pageContainer = document.querySelector('.page-main__container');
const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, waypointsModel);
filterPresenter.init();

const tripPresenter = new TripPesenter(tripEventsElement, tripMainElement, waypointsModel, filterModel, offersModel, destinationsModel, EDIT_FORM, buttonNewEventComponent);
tripPresenter.init();

render(tripNavigationElement, navigationComponent, RenderPosition.BEFOREEND);
render(tripMainElement, buttonNewEventComponent, RenderPosition.BEFOREEND);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_EVENT:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      navigationComponent.removeClassItem(MenuItem.STATS);
      navigationComponent.addClassItem(MenuItem.TABLE);
      tripPresenter.createWaypoint();
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      remove(statisticsComponent);
      navigationComponent.removeClassItem(MenuItem.STATS);
      navigationComponent.addClassItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(waypointsModel);
      render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
      navigationComponent.removeClassItem(MenuItem.TABLE);
      navigationComponent.addClassItem(MenuItem.STATS);
      break;
  }
};

navigationComponent.setMenuClickHandler(handleSiteMenuClick);
buttonNewEventComponent.setMenuClickHandler(handleSiteMenuClick);
