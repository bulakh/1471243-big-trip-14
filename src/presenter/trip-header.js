import NavigationView from '../view/navigation.js';
import FiltersView from '../view/filters.js';
import InformationRoutView from '../view/information-rout.js';
import {generateInformationOfRout, generateEmptyInformation} from '../mock/information-rout.js';
import {render, RenderPosition} from '../utils/render.js';

let informationOfRout;

export default class TripHeader {
  constructor(tripMain, tripNavigation, tripFilters) {
    this._tripMain = tripMain;
    this._tripNavigation = tripNavigation;
    this._tripFilters = tripFilters;
    this._informationOfRout = informationOfRout;

    this._navigationComponent = new NavigationView();
    this._filtersComponent = new FiltersView();
  }

  init(waypoints) {
    if (waypoints.length === 0) {
      this._informationOfRout = generateEmptyInformation();
    } else {
      this._informationOfRout = generateInformationOfRout(waypoints);
    }

    this._informationRoutComponent = new InformationRoutView(this._informationOfRout);

    this._renderTripHeader();
  }

  _renderInformationRout() {
    render(this._tripMain, this._informationRoutComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNavigation() {
    render(this._tripNavigation, this._navigationComponent, RenderPosition.BEFOREEND);
  }

  _renderFilters() {
    render(this._tripFilters, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderTripHeader() {
    this._renderInformationRout();
    this._renderNavigation();
    this._renderFilters();
  }
}
