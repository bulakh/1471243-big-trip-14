import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const getDayOfStartEvent = (dateFrom) => {return dayjs(dateFrom).format('D MMMM');};

export const getTimeStart = (dateFrom) => {return dayjs(dateFrom).format('HH:mm');};
export const getTimeEnd = (dateTo) => {return dayjs(dateTo).format('HH:mm');};

export const getTimeStartOpenCard = (dateFrom) => {return dayjs(dateFrom).format('DD/MM/YY HH:mm');};
export const getTimeEndOpenCard = (dateTo) => {return dayjs(dateTo).format('DD/MM/YY HH:mm');};

export const getTimeStartHeader = (dateFrom) => {return dayjs(dateFrom).format('MMMM D');};
export const getTimeEndHeader = (dateTo) => {return dayjs(dateTo).format('MMMM DD');};

export const getFutureDate = (dateFrom) => {
  return dayjs(dateFrom) >= dayjs(new Date());
};

export const getPastDate = (dateTo) => {
  return dayjs(dateTo) <= dayjs(new Date());
};

export const getNowDate = (dateFrom, dateTo) => {
  return dayjs(dateFrom) <= dayjs(new Date()) && dayjs(dateTo) >= dayjs(new Date());
};

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

export const sortTime = (waypointA, waypointB) => {
  const waypointAdateFrom = dayjs(waypointA.dateFrom);
  const waypointBdateFrom = dayjs(waypointB.dateFrom);
  const waypointAdateTo = dayjs(waypointA.dateTo);
  const waypointBdateTo = dayjs(waypointB.dateTo);
  const diffDateWaypointA = waypointAdateTo.diff(waypointAdateFrom);
  const diffDateWaypointB = waypointBdateTo.diff(waypointBdateFrom);


  const weight = getWeightForNullCount(waypointA.dateFrom, waypointB.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return diffDateWaypointB - diffDateWaypointA;
};

export const sortPrice = (waypointA, waypointB) => {
  const waypointAbasePrice = waypointA.basePrice;
  const waypointBbasePrice = waypointB.basePrice;

  const weight = getWeightForNullCount(waypointAbasePrice, waypointBbasePrice);

  if (weight !== null) {
    return weight;
  }

  return waypointBbasePrice - waypointAbasePrice;
};

export const sortDate = (waypointA, waypointB) => {
  const waypointAdateFrom = waypointA.dateFrom;
  const waypointBbdateFrom = waypointB.dateFrom;

  const weight = getWeightForNullCount(waypointAdateFrom, waypointBbdateFrom);

  if (weight !== null) {
    return weight;
  }

  return waypointAdateFrom - waypointBbdateFrom;
};

export const getDifferenceToFormat = (differenceInMs) => {
  const MS_IN_HOUR = 3600000;
  const MS_IN_DAY = 86400000;

  const addDoubleCountFormat = (number) => {
    const COUNT_SYMBOLS = 1;

    const lengthOfNumber = String(number).split('').length;

    if (lengthOfNumber === COUNT_SYMBOLS) {
      return '0' + number;
    }
    return number;
  };

  const daysFormat = dayjs.duration(differenceInMs).days();
  const hoursFormat = dayjs.duration(differenceInMs).hours();
  const minutesFormat = dayjs.duration(differenceInMs).minutes();

  const difference = {
    days: addDoubleCountFormat(daysFormat) + 'D ',
    hours: addDoubleCountFormat(hoursFormat) + 'H ',
    minutes: addDoubleCountFormat(minutesFormat) + 'M',
  };

  if (differenceInMs < MS_IN_HOUR) {
    return difference.minutes;
  } else if (differenceInMs < MS_IN_DAY) {
    return difference.hours + difference.minutes;
  }
  return difference.days + difference.hours + difference.minutes;
};

export const createDurationTime = (start, end) => {
  dayjs.extend(duration);
  dayjs.duration(100);

  const differenceInMs = dayjs(end).diff(dayjs(start));

  return getDifferenceToFormat(differenceInMs);
};

export const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'day');
};

export const checkPrice = (price) => {
  const countPrice = Math.floor(price);
  if (countPrice < 0) {
    return countPrice * (-1);
  }
  return parseInt(countPrice, 10);
};

export const getAllNameDestinations = (destinationsModel) => {
  const destinations = destinationsModel.get();
  const allDestinations = [];
  for (const destination of destinations) {
    const map = new Map(Object.entries(destination));
    const name = map.get('name');
    allDestinations.push(name.toLowerCase());
  }
  return allDestinations;
};

export const getOfferIds = (type, checkedOffers, allOffers) => {
  const offerIds = [];

  allOffers.map((currentTypeOffer) => {
    if (currentTypeOffer.type === type) {
      currentTypeOffer.offers.map((concreteOffer) => {

        checkedOffers.map((checkedOffer) => {
          if (checkedOffer.title === concreteOffer.title) {
            offerIds.push(concreteOffer.id);
          }
        });
      });
    }
  });
  return offerIds;
};

export const getOffersOnId = (type, offerIds, allOffers) => {
  const offers = [];

  allOffers.map((currentTypeOffer) => {
    if (currentTypeOffer.type === type) {
      currentTypeOffer.offers.map((concreteOffer) => {

        offerIds.map((offerId) => {
          if (concreteOffer.id === offerId) {
            const offer = {
              title: concreteOffer.title,
              price: concreteOffer.price,
            };
            offers.push(offer);
          }
        });
      });
    }
  });
  return offers;
};

export const getDestination = (nameDestination, allDestinations) => {
  let dueDestination;
  allDestinations.map((destination) => {
    if (destination.name === nameDestination) {
      dueDestination = destination;
    }
  });
  return dueDestination;
};
