import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const dayOfStartEvent = (dateFrom) => {return dayjs(dateFrom).format('D MMMM');};
export const timeStart = (dateFrom) => {return dayjs(dateFrom).format('HH:mm');};
export const timeEnd = (dateTo) => {return dayjs(dateTo).format('HH:mm');};
export const timeStartOpenCard = (dateFrom) => {return dayjs(dateFrom).format('DD/MM/YY HH:mm');};
export const timeEndOpenCard = (dateTo) => {return dayjs(dateTo).format('DD/MM/YY HH:mm');};

const getWeightForNullCount = (CountA, CountB) => {
  if (CountA === null && CountB === null) {
    return 0;
  }

  if (CountA === null) {
    return 1;
  }

  if (CountB === null) {
    return -1;
  }

  return null;
};

export const sortTime = (waypointA, waypointB) => {
  const waypointAdateFrom = dayjs(waypointA.dateFrom);
  const waypointBdateFrom = dayjs(waypointB.dateFrom);
  const waypointAdateTo = dayjs(waypointA.dateTo);
  const waypointBdateTo = dayjs(waypointB.dateTo);
  const diffDateWaypointA = waypointAdateTo.diff(waypointAdateFrom);
  const diffDateWaypointB = waypointBdateTo.diff(waypointBdateFrom);


  const weight = getWeightForNullCount(waypointA.dateFrom, waypointB.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return diffDateWaypointB - diffDateWaypointA;
};

export const sortPrice = (waypointA, waypointB) => {
  const waypointAbasePrice = waypointA.basePrice;
  const waypointBbasePrice = waypointB.basePrice;

  const weight = getWeightForNullCount(waypointAbasePrice, waypointBbasePrice);

  if (weight !== null) {
    return weight;
  }

  return waypointBbasePrice - waypointAbasePrice;
};

export const sortDate = (waypointA, waypointB) => {
  const waypointAdateFrom = waypointA.dateFrom;
  const waypointBbdateFrom = waypointB.dateFrom;

  const weight = getWeightForNullCount(waypointAdateFrom, waypointBbdateFrom);

  if (weight !== null) {
    return weight;
  }

  return waypointAdateFrom - waypointBbdateFrom;
};

export const generateDurationTime = (start, end) => {
  const MS_IN_HOUR = 3600000;
  const MS_IN_DAY = 86400000;

  dayjs.extend(duration);
  dayjs.duration(100);

  const differenceInMs = dayjs(end).diff(dayjs(start));

  const difference = {
    days: dayjs.duration(differenceInMs).days() + 'D ',
    hours: dayjs.duration(differenceInMs).hours() + 'H ',
    minutes: dayjs.duration(differenceInMs).minutes() + 'M',
  };

  if (differenceInMs < MS_IN_HOUR) {
    return difference.minutes;
  } else if (differenceInMs < MS_IN_DAY) {
    return difference.hours + difference.minutes;
  }
  return difference.days + difference.hours + difference.minutes;
};
