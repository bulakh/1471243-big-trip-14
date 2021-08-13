import dayjs from 'dayjs';

export const getUniqTypes = (waypoints) => {
  const types = [];
  for (const waypoint of waypoints) {
    const map = new Map(Object.entries(waypoint));
    const type = map.get('type');
    types.push(type);
  }
  return [...new Set(types)];
};

export const getPricesFromType = (waypoints, types) => {
  const prices = [];

  types.map((elemX) => {
    const filteredOnType = waypoints.filter((waypoint) => waypoint.type === elemX);
    const pricesOfType = [];

    filteredOnType.map((elemY) => {
      pricesOfType.push(elemY.basePrice);
    });

    const typeAndPrice = {
      type: elemX,
      price: pricesOfType.reduce((a, b) => a + b, 0),
    };
    prices.push(typeAndPrice);
  });

  return prices;
};

export const getCountTypes = (waypoints, types) => {
  const counts = [];

  types.map((elemX) => {
    const filteredOnType = waypoints.filter((waypoint) => waypoint.type === elemX);
    const typeAndCount = {
      type: elemX,
      count: filteredOnType.length,
    };
    counts.push(typeAndCount);
  });
  return counts;
};

export const getTimeFromType = (waypoints, types) => {
  const times = [];

  types.map((elemX) => {
    const filteredOnType = waypoints.filter((waypoint) => waypoint.type === elemX);
    const sumsDiffInMs = [];
    filteredOnType.map((elemY) => sumsDiffInMs.push(dayjs(elemY.dateTo).diff(dayjs(elemY.dateFrom))));
    const typeAndTime = {
      type: elemX,
      time: sumsDiffInMs.reduce((a, b) => a + b, 0),
    };
    times.push(typeAndTime);
  });
  return times;
};

