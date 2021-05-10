import FiltersView from '../view/filter.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel, waypointsModel){
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._waypointsModel = waypointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const waypoints = this._waypointsModel.getWaypoints();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filter[FilterType.EVERYTHING](waypoints).length,

      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](waypoints).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](waypoints).length,
      },
    ];
  }
}
