export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


export const findDueOffer = (Offers, type) => {
  const findObject = (elem) => {
    if (elem.type === type) {
      return elem;
    }
  };

  return Offers.find(findObject);
};

export const findDueDestination = (Destinations, destination) => {
  const findObject = (elem) => {
    if (elem.name === destination) {
      return elem;
    }
  };

  return Destinations.find(findObject);
};

// export const getOfferIdsIsChecked = (Offer) => {
//   const offers = Offer.offers;
//   const offerIdsIsChecked = new Array();
//   for (const offer of offers) {
//     const map = new Map(Object.entries(offer));
//     const id = map.get('id');
//     const isChecked = map.get('isChecked');
//     if (isChecked) {
//       offerIdsIsChecked.push(id);
//     }
//   }
//   return offerIdsIsChecked;
// };
