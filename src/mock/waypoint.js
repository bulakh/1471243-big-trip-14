import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {TYPES, DESTINATIONS} from '../const.js';
import {getRandomInteger} from '../utils/common.js';
import {generateDurationTime} from '../utils/waypoint.js';
import {allOffers} from './offer.js';

const generateBasePrice = () => {
  const MAX_BASE_PRICE = 100;
  const price = getRandomInteger(0, MAX_BASE_PRICE) + '0';
  return price;
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

const generateDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

const generateOfferIds = (type, allOffers) => {
  const offerIds = new Array();
  allOffers.map((typeOffers) => {
    if (typeOffers.type === type) {
      typeOffers.offers.map((concreteOffer) => {
        offerIds.push(concreteOffer.id);
      });
    }
  });
  return offerIds.splice(getRandomInteger(0, 5), getRandomInteger(1, 3));
};

export const generateWaypoint = () => {
  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);
  const durationTime = generateDurationTime(dateFrom, dateTo);
  const nameDestination = generateDestination();
  const typeEvent = generateType();

  return {
    id: nanoid(),
    type: typeEvent,
    destination: nameDestination,
    basePrice: generateBasePrice(),
    dateFrom,
    dateTo,
    durationTime,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offerIds: generateOfferIds(typeEvent, allOffers),
  };
};
