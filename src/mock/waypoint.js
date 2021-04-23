import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {nanoid} from 'nanoid';
import {TYPES, DESTINATIONS, TITLES_OFFERS} from '../const.js';
import {getRandomInteger} from '../utils/common.js';
import {generateChiefOffer} from './offer.js';


const generateBasePrice = () => {
  const MAX_BASE_PRICE = 100;
  const price = getRandomInteger(0, MAX_BASE_PRICE) + '0';
  return price;
};


const generateInformation = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra',
    'Aliquam id orci ut lectus varius viverra',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'Sed sed nisi sed augue convallis suscipit in sed felis',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus',
    'In rutrum ac purus sit amet tempus',
  ];

  const randomIndex = getRandomInteger(1, descriptions.length - 1);
  const randomDescriptions = new Array;

  for (let i = 0; i < randomIndex; i++) {
    randomDescriptions.push(descriptions[i]);
  }

  return randomDescriptions.join('. ') + '.';
};

const generateDateFrom = () => {
  const MAX_DAY_ADD = 7;
  const MAX_HOUR_ADD = 23;
  const MAX_MINUTE_ADD = 59;

  const daysAdd = getRandomInteger(-7, MAX_DAY_ADD);
  const hourAny = getRandomInteger(0, MAX_HOUR_ADD);
  const minuteAny = getRandomInteger(0, MAX_MINUTE_ADD);

  return dayjs().add(daysAdd, 'day').hour(hourAny).minute(minuteAny).toDate();
};

const generateDateTo = (date) => {
  const MAX_DAY_ADD = 3;
  const MAX_HOUR_ADD = 23;
  const MAX_MINUTE_ADD = 59;

  const daysAdd = getRandomInteger(0, MAX_DAY_ADD);
  const hourAdd = getRandomInteger(0, MAX_HOUR_ADD);
  const minuteAdd = getRandomInteger(0, MAX_MINUTE_ADD);

  return dayjs(date).add(daysAdd, 'day').add(hourAdd, 'hour').add(minuteAdd, 'minute');
};

const generateDurationTime = (start, end) => {
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

const generateDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generateSrcPhotos = () => {
  const numberPhoto = getRandomInteger(0, 100);

  return 'http://picsum.photos/248/152?r=' + numberPhoto;
};

const generatePictureDesription = () => {
  const descriptions = ['Beatiful city', 'Sunny day', 'Nice holidays', 'Big present', 'My favorite village'];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const renderPhotos = () => {
  const COUNT_PHOTO = 5;
  const randomCountPhoto = getRandomInteger(1, COUNT_PHOTO);
  const photos = new Array;

  for (let i = 1; i < randomCountPhoto; i++) {
    photos.push({
      src: generateSrcPhotos(),
      description: generatePictureDesription(),
    });
  }
  return photos;
};

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

export const generateWaypoint = () => {
  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);
  const durationTime = generateDurationTime(dateFrom, dateTo);
  const nameDestination = generateDestination();
  const typeEvent = generateType();
  const Offer = generateChiefOffer(typeEvent, TITLES_OFFERS);

  return {
    id: nanoid(),
    type: typeEvent,
    destination: nameDestination,
    basePrice: generateBasePrice(),
    dateFrom,
    dateTo,
    durationTime,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    DestinationInformation: {
      description: generateInformation(),
      name: nameDestination,
      pictures: renderPhotos(),
    },
    Offer,
  };
};
