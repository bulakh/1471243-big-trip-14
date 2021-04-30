import {getRandomInteger} from '../utils/common.js';
import {nanoid} from 'nanoid';


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

export const generateChiefOffer = (type, titles) => {
  return {
    type: type,
    offers: generateOffers(titles),
  };
};

