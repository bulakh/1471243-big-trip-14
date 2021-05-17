import StatisticsView from '../view/statistics.js';
import {MenuItem, UpdateType, FilterType} from '../const.js';
import {render, RenderPosition, remove} from '../utils/render.js';

export default class Navigation {
  constructor(pageContainer, waypointsModel, offersModel, navigationComponent, buttonNewEventComponent, tripPresenter, filterModel) {
    this._pageContainer = pageContainer;

    this._navigationComponent = navigationComponent;
    this._buttonNewEventComponent = buttonNewEventComponent;
    this._statisticsComponent = null;

    this._tripPresenter = tripPresenter;

    this._filterModel = filterModel;
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;

    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
  }

  init() {
    this._navigationComponent.setMenuClickHandler(this._handleSiteMenuClick);
    this._buttonNewEventComponent.setMenuClickHandler(this._handleSiteMenuClick);
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.ADD_EVENT:
        remove(this._statisticsComponent);
        this._tripPresenter.destroy();
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        this._tripPresenter.init();
        this._navigationComponent.removeClassItem(MenuItem.STATS);
        this._navigationComponent.addClassItem(MenuItem.TABLE);
        this._tripPresenter.createWaypoint();
        break;
      case MenuItem.TABLE:
        this._tripPresenter.init();
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        remove(this._statisticsComponent);
        this._navigationComponent.removeClassItem(MenuItem.STATS);
        this._navigationComponent.addClassItem(MenuItem.TABLE);
        break;
      case MenuItem.STATS:
        this._tripPresenter.destroy();
        this._statisticsComponent = new StatisticsView(this._waypointsModel, this._offersModel);
        render(this._pageContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
        this._navigationComponent.removeClassItem(MenuItem.TABLE);
        this._navigationComponent.addClassItem(MenuItem.STATS);
        break;
    }
  }
}