import dayjs from 'dayjs';

const sortDate = (waypoints) => {
  return waypoints.sort((a,b) => a.dateFrom - b.dateFrom);
};

const getSumCost = (waypoints) => {
  let priceCount = 0;
  for (const waypoint of waypoints) {
    const map = new Map(Object.entries(waypoint));
    const price = map.get('basePrice');
    priceCount+= Number(price);
  }
  return priceCount;
};

const timeStart = (dateFrom) => {return dayjs(dateFrom).format('MMMM D');};
const timeEnd = (dateTo) => {return dayjs(dateTo).format('MMMM DD');};

export const generateInformationOfRout = (waypoints) => {
  const sortedWaypoints = sortDate(waypoints);

  const firstDestination = sortedWaypoints[0].destination;
  const secondDestination = sortedWaypoints.length === 3 ? sortedWaypoints[1].destination : '...';
  const lastDestination = sortedWaypoints[sortedWaypoints.length - 1].destination;
  const startDay = timeStart(sortedWaypoints[0].dateFrom);
  const lastDay = timeEnd(sortedWaypoints[sortedWaypoints.length - 1].dateFrom);
  const sumOfCosts = getSumCost(waypoints);
  return {
    firstDestination,
    secondDestination,
    lastDestination,
    startDay,
    lastDay,
    sumOfCosts,
  };
};

export const generateEmptyInformation = () => {
  return {
    firstDestination: 'Berlin',
    secondDestination: 'Paris',
    lastDestination: 'Lisbon',
    startDay: '',
    lastDay: '',
    sumOfCosts: '',
  };
};
