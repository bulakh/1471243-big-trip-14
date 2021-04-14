import dayjs from 'dayjs';

export const dayOfStartEvent = (dateFrom) => {return dayjs(dateFrom).format('D MMMM');};
export const timeStart = (dateFrom) => {return dayjs(dateFrom).format('HH:mm');};
export const timeEnd = (dateTo) => {return dayjs(dateTo).format('HH:mm');};
export const timeStartOpenCard = (dateFrom) => {return dayjs(dateFrom).format('DD/MM/YY HH:mm');};
export const timeEndOpenCard = (dateTo) => {return dayjs(dateTo).format('DD/MM/YY HH:mm');};
