import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import NavigationPresenter from './presenter/navigation.js';
import WaypointsModel from './model/waypoints.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import FiltersModel from './model/filters.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {toast} from './utils/toast.js';
import {UpdateType} from './const.js';
import NavigationView from './view/navigation.js';
import ButtonNewEventView from './view/button-new-event.js';
import LoadingView from './view/loading.js';
import ErrorView from './view/error.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic 4Sf78f5sd5qddfT5G';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const EDIT_FORM = true;


const navigationComponent = new NavigationView();
const buttonNewEventComponent = new ButtonNewEventView();
const loadingEvent = new LoadingView();
const errorEvent = new ErrorView();

const pageContainer = document.querySelector('.page-main__container');
const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FiltersModel();

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filterPresenter = new FiltersPresenter(tripFiltersElement, filterModel, waypointsModel);
filterPresenter.init();

const tripPresenter = new TripPesenter(
  tripEventsElement,
  tripMainElement,
  waypointsModel,
  filterModel,
  offersModel,
  destinationsModel,
  EDIT_FORM,
  buttonNewEventComponent,
  loadingEvent,
  apiWithProvider);
tripPresenter.init();

const navigationPresenter = new NavigationPresenter(
  pageContainer,
  waypointsModel,
  navigationComponent,
  buttonNewEventComponent,
  tripPresenter,
  filterModel);
navigationPresenter.init();

apiWithProvider.getAllDataFromServer()
  .then((data) => {
    const [waypointsData, offersData, destinationsData] = data;
    offersModel.set(UpdateType.INIT, offersData);
    destinationsModel.set(UpdateType.INIT, destinationsData);
    waypointsModel.set(UpdateType.INIT, waypointsData);

    render(tripNavigationElement, navigationComponent, RenderPosition.BEFOREEND);
    render(tripMainElement, buttonNewEventComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    remove(loadingEvent);
    render(tripEventsElement, errorEvent , RenderPosition.BEFOREEND);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  const SUCCESS_MESSAGE = true;
  document.title = document.title.replace(' [offline]', '');
  toast('You are online!', SUCCESS_MESSAGE);
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  toast('You are offline!');
  document.title += ' [offline]';
});

