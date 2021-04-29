export const fillWaypoints =
  [
    {
      id: '123aa',
      type: 'taxi',
      destination: 'Rome',
      basePrice: 60,
      dateFrom: 'Sun Apr 25 2021 15:50:37 GMT+0300',
      dateTo: 'Sun Apr 25 2021 18:14:37 GMT+0300',
      durationTime: '2H 24M',
      isFavorite: true,
      DestinationInformation: {
        description: 'Rome is the capital of Italy',
        name: 'Rome',
        pictures: [
          {
            src: 'https://static.dw.com/image/52770177_303.jpg',
            description: 'Beatiful Rome',
          },
          {
            src: 'https://static.dw.com/image/52772411_401.jpg',
            description: 'Good peace of Rome',
          },
        ],
      },
      Offer: {
        type: 'taxi',
        offers: [
          {
            id: '1',
            title: 'Good taxi',
            price: 20,
            isChecked: true,
          },
          {
            id: '2',
            title: 'Best seat',
            price: 20,
            isChecked: false,
          },
        ],
      },
    },

    {
      id: '123bb',
      type: 'drive',
      destination: 'Berlin',
      basePrice: 100,
      dateFrom: 'Sun Apr 26 2021 15:50:37 GMT+0300',
      dateTo: 'Sun Apr 26 2021 18:14:37 GMT+0300',
      durationTime: '3H 24M',
      isFavorite: false,
      DestinationInformation: {
        description: 'Berlin is the capital of Germany',
        name: 'Berlin',
        pictures: [
          {
            src: 'https://letsportpeople.com/wp-content/uploads/2019/08/berlin-halfmarathon-2021-bronze-cover-945x525.jpg',
            description: 'Beatiful Berlin',
          },
          {
            src: 'https://cdn2.tu-tu.ru/image/pagetree_node_data/1/bb1dcb9933b840889a1306a81f976b78/',
            description: 'Good peace of Berlin',
          },
        ],
      },
      Offer: {
        type: 'drive',
        offers: [
          {
            id: '3',
            title: 'Smoke driver',
            price: 40,
            isChecked: false,
          },
          {
            id: '4',
            title: 'With veterok',
            price: 50,
            isChecked: true,
          },
        ],
      },
    },

    {
      id: '123cc',
      type: 'ship',
      destination: 'Moscow',
      basePrice: 500,
      dateFrom: 'Sun Apr 23 2021 15:50:37 GMT+0300',
      dateTo: 'Sun Apr 23 2021 18:14:37 GMT+0300',
      durationTime: '24M',
      isFavorite: true,
      DestinationInformation: {
        description: 'Moscow is the capital of Russia',
        name: 'Moscow',
        pictures: [
          {
            src: 'https://img.theculturetrip.com/1440x807/smart/wp-content/uploads/2019/11/gettyimages-1141703970.jpg',
            description: 'Beatiful Moscow',
          },
          {
            src: 'https://www.nationsonline.org/gallery/Russia/State-Historical-Museum-Moscow.jpg',
            description: 'Good peace of Moscow',
          },
        ],
      },
      Offer: {
        type: 'ship',
        offers: [
          {
            id: '5',
            title: 'Best master',
            price: 80,
            isChecked: true,
          },
          {
            id: '6',
            title: 'Sea sick',
            price: 20,
            isChecked: true,
          },
        ],
      },
    },
  ];
