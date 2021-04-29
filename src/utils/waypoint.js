import dayjs from 'dayjs';

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
  const waypointAbasePrice = dayjs(waypointA.basePrice);
  const waypointBbasePrice = dayjs(waypointB.basePrice);

  const weight = getWeightForNullCount(waypointA.basePrice, waypointB.basePrice);

  if (weight !== null) {
    return weight;
  }

  return waypointBbasePrice - waypointAbasePrice;
};
