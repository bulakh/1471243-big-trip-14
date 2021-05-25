import AbstractView from './abstract.js';

const createWaypointsListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class WaypointsList extends AbstractView {
  getTemplate() {
    return createWaypointsListTemplate();
  }
}
