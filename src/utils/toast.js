const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message, SUCCESS_MESSAGE) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  toastContainer.append(toastItem);

  if (SUCCESS_MESSAGE) {
    toastItem.style.border = 'solid 1px #058C0A';
    toastItem.style.backgroundColor = '#DAF5DB';
    toastItem.style.color = '#058C0A';
  }

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export {toast};
