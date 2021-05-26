import AbstractView from './abstract.js';

const createErrorTemplate = () => {
  return '<p class="trip-events__msg">Sorry, something went wrong there. Try again</p>';
};

export default class Error extends AbstractView {
  getTemplate() {
    return createErrorTemplate();
  }
}
