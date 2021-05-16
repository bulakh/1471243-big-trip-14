export const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const TITLES_OFFERS = ['Choose meal', 'Upgrade to comfort class', 'Order Uber', 'Add luggage', 'Switch to comfort'];
export const DESTINATIONS = ['Paris', 'Rome', 'Berlin', 'Lisbon', 'Barcelona', 'Amsterdam', 'Moscow'];

export const EMPTY_WAYPOINT = {
  id: '',
  type: TYPES[0],
  destination:  '',
  basePrice: '',
  dateFrom : new Date(),
  dateTo: new Date(),
  durationTime: '',
  isFavorite: false,
  offerIds: [],
};

export const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
  ADD_EVENT: 'ADD_EVENT',
};
