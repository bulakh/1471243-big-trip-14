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

export {sortDate, timeStart, timeEnd, getSumCost};
