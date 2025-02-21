// Create a standard popup container
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

function createPopupForm(id) {
  const form = document.createElement('form');
  form.id = id;
  form.className = 'popup__form';
  return form;
}

function createInput(type, placeholder, required = true) {
  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.required = required;
  input.className = 'popup__input';
  return input;
}

// Create a standard button container with submit and cancel buttons
function createButtonContainer(submitText, cancelCallback, submitClassName = 'popup__submit-btn', cancelClassName = 'popup__cancel-btn') {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'popup__button-container';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = submitText;
  submitButton.className = submitClassName;

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  cancelButton.className = cancelClassName;
  cancelButton.onclick = cancelCallback;

  buttonsContainer.appendChild(submitButton);
  buttonsContainer.appendChild(cancelButton);

  return buttonsContainer;
}

// Close any popup by ID
function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.remove();
  }
}
