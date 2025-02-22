function createPopup(id, title) {
  const popup = document.createElement('div');
  popup.id = id;
  popup.className = 'popup';

  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'popup__overlay';

  const popupContent = document.createElement('div');
  popupContent.className = 'popup__content';

  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.className = 'popup__title';
    titleElement.textContent = title;
    popupContent.appendChild(titleElement);
  }

  popup.appendChild(popupOverlay);
  popup.appendChild(popupContent);
  document.body.appendChild(popup);

  return { popup, popupContent };
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.remove();
  }
}