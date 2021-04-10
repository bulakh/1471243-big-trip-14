import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const dayOfStartEvent = (dateFrom) => {return dayjs(dateFrom).format('D MMMM');};
const timeStart = (dateFrom) => {return dayjs(dateFrom).format('HH:mm');};
const timeEnd = (dateTo) => {return dayjs(dateTo).format('HH:mm');};
const timeStartOpenCard = (dateFrom) => {return dayjs(dateFrom).format('DD/MM/YY HH:mm');};
const timeEndOpenCard = (dateTo) => {return dayjs(dateTo).format('DD/MM/YY HH:mm');};

export {getRandomInteger, dayOfStartEvent, timeStart, timeEnd, timeStartOpenCard, timeEndOpenCard};
