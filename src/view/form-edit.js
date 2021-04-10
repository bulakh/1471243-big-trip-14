const toggleEditCancelButton = (edit) => {
  return edit ? 'Delete' : 'Cancel';
};

const renderRollupButton = (edit) => {
  return edit ? `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>` : '';
};

export {toggleEditCancelButton, renderRollupButton};
