import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUniqTypes, getPricesFromType, getCountTypes, getTimeFromType} from '../utils/statistics.js';
import {getDifferenceToFormat} from '../utils/waypoint.js';

const renderMoneyChart = (moneyCtx, waypoints, uniqTypes) =>{
  const allPrices = getPricesFromType(waypoints, uniqTypes);
  const sortedPricesAndTypes = allPrices.sort((a,b) => b.price - a.price);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedPricesAndTypes.map((elem) => elem.type.toUpperCase()),
      datasets: [{
        data: sortedPricesAndTypes.map((elem) => elem.price),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 50,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, waypoints, uniqTypes) => {
  const countOfTypes = getCountTypes(waypoints, uniqTypes);
  const sortedCountAndTypes = countOfTypes.sort((a,b) => b.count - a.count);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedCountAndTypes.map((elem) => elem.type.toUpperCase()),
      datasets: [{
        data: sortedCountAndTypes.map((elem) => elem.count),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 50,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, waypoints, uniqTypes) => {
  const timeOfTypes = getTimeFromType(waypoints, uniqTypes);
  const sortedTimeAndTypes = timeOfTypes.sort((a,b) => b.time - a.time);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedTimeAndTypes.map((elem) => elem.type.toUpperCase()),
      datasets: [{
        data: sortedTimeAndTypes.map((elem) => elem.time),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 70,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDifferenceToFormat(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(waypointsModel) {
    super();

    this._data = waypointsModel.get();

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._uniqTypes = getUniqTypes(this._data);

    this._setCharts();

  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const BAR_HEIGHT = 55;
    let MULTIPLY = 5;
    if (this._uniqTypes.length >= 8) {
      MULTIPLY = 8;
    } else if (this._uniqTypes.length < 3) {
      MULTIPLY = 2;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    moneyCtx.height = BAR_HEIGHT * MULTIPLY;
    typeCtx.height = BAR_HEIGHT * MULTIPLY;
    timeCtx.height = BAR_HEIGHT * MULTIPLY;

    this._moneyChart = renderMoneyChart(moneyCtx, this._data, this._uniqTypes);
    this._typeChart = renderTypeChart(typeCtx, this._data, this._uniqTypes);
    this._timeChart = renderTimeChart(timeCtx, this._data, this._uniqTypes);
  }

}
