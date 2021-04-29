const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const TITLES_OFFERS = ['Choose meal', 'Upgrade to comfort class', 'Order Uber', 'Add luggage', 'Switch to comfort'];
const DESTINATIONS = ['Paris', 'Rome', 'Berlin', 'Lisbon', 'Barcelona', 'Amsterdam', 'Moscow'];

const EMPTY_WAYPOINT = [{
  type: TYPES[0],
  destination:  DESTINATIONS[4],
  basePrice: '',
  dateFrom : '',
  dateTo: '',
  durationTime: null,
  isFavorite: false,
  id: '',
  Offer: {
    type: TYPES[0],
    offers: '',
  },
  DestinationInformation: {
    description: '',
    name: DESTINATIONS[0],
    pictures: '',
  },
}];

const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

export {TYPES, DESTINATIONS, TITLES_OFFERS, EMPTY_WAYPOINT, SortType};
