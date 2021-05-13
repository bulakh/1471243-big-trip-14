import {getRandomInteger} from '../utils/common.js';
import {nanoid} from 'nanoid';
import {TYPES, TITLES_OFFERS} from '../const.js';


const generateOffer = (title) => {
  return {
    id: nanoid(),
    title: title,
    price: getRandomInteger(1, 10) + '0',
    isChecked: Boolean(getRandomInteger(0, 1)),
  };
};

const generateOffers = (titles) => {
  const offers = new Array;
  for (const title of titles) {
    const offer = generateOffer(title);
    offers.push(offer);
  }
  return offers;
};

export const generateItemOffer = (type, titles) => {
  return {
    type: type,
    offers: generateOffers(titles),
  };
};

export const allOffers = new Array();
for (const type of TYPES) {
  const offer = generateItemOffer(type, TITLES_OFFERS);
  allOffers.push(offer);
}

