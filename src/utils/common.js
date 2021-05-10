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
