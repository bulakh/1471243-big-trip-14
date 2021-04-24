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

const getMinutesFromDurationTime = (time) => {
  let countMinute = 0;
  const separateTimes = time.split(' ');
  separateTimes.forEach((elem) => {
    if (/\d+d/gi.test(elem)) {
      countMinute += parseInt(elem, 10) * 1440;
    }
    if (/\d+h/gi.test(elem)) {
      countMinute += parseInt(elem, 10) * 60;
    }
    if (/\d+m/gi.test(elem)) {
      countMinute += parseInt(elem, 10);
    }
  });
  return countMinute;
};

export const sortTime = (waypointA, waypointB) => {
  const weight = getWeightForNullCount(waypointA.durationTime, waypointB.durationTime);

  if (weight !== null) {
    return weight;
  }

  return getMinutesFromDurationTime(waypointB.durationTime) - getMinutesFromDurationTime(waypointA.durationTime);
};

export const sortPrice = (waypointA, waypointB) => {
  const weight = getWeightForNullCount(waypointA.basePrice, waypointB.basePrice);

  if (weight !== null) {
    return weight;
  }

  return waypointB.basePrice - waypointA.basePrice;
};
