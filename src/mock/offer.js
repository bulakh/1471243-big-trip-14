import {getRandomInteger} from '../utils/common.js';


const generateOffer = (title, id) => {
  return {
    id: id,
    title: title,
    price: getRandomInteger(1, 10) + '0',
    isChecked: Boolean(getRandomInteger(0, 1)),
  };
};

const generateOffers = (titles) => {
  const offers = new Array;
  let countID = 0;
  for (const title of titles) {
    countID++;
    const offer = generateOffer(title, countID);
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

