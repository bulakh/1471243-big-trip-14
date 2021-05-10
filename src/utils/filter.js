import {FilterType} from '../const';
import {futureDate, pastDate} from './waypoint.js';

export const filter  = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => futureDate(waypoint.dateFrom)),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => pastDate(waypoint.dateFrom)),
};
