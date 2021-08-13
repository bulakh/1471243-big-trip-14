import {FilterType} from '../const';
import {getFutureDate, getPastDate, getNowDate} from './waypoint.js';

export const filter  = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => {
    return getFutureDate(waypoint.dateFrom) || getNowDate(waypoint.dateFrom, waypoint.dateTo);
  }),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => {
    return getPastDate(waypoint.dateTo) || getNowDate(waypoint.dateFrom, waypoint.dateTo);
  }),
};
