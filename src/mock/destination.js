import {DESTINATIONS} from '../const.js';
import {getRandomInteger} from '../utils/common.js';

const generateInformation = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra',
    'Aliquam id orci ut lectus varius viverra',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'Sed sed nisi sed augue convallis suscipit in sed felis',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus',
    'In rutrum ac purus sit amet tempus',
  ];

  const randomIndex = getRandomInteger(1, descriptions.length - 1);
  const randomDescriptions = new Array;

  for (let i = 0; i < randomIndex; i++) {
    randomDescriptions.push(descriptions[i]);
  }

  return randomDescriptions.join('. ') + '.';
};

const generateSrcPhotos = () => {
  const numberPhoto = getRandomInteger(0, 1000);

  return 'http://picsum.photos/248/152?r=' + numberPhoto;
};

const generatePictureDesription = () => {
  const descriptions = ['Beatiful city', 'Sunny day', 'Nice holidays', 'Big present', 'My favorite village'];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const renderPhotos = () => {
  const COUNT_PHOTO = 5;
  const randomCountPhoto = getRandomInteger(1, COUNT_PHOTO);
  const photos = new Array;

  for (let i = 1; i < randomCountPhoto; i++) {
    photos.push({
      src: generateSrcPhotos(),
      description: generatePictureDesription(),
    });
  }
  return photos;
};

export const generateItemDestination = (nameDestination) => {
  return {
    name: nameDestination,
    description: generateInformation(),
    pictures: renderPhotos(),
  };
};

export const allDestinations = new Array();
for (const nameDestination of DESTINATIONS) {
  const destination = generateItemDestination(nameDestination);
  allDestinations.push(destination);
}
