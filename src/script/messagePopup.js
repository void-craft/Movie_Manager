function showMessage(message, type = 'success') {
  const existingNotification = document.getElementById('notificationMessage');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'notificationMessage';
  notification.className = `notification-message notification-message--${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('notification-message--fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function showSuccessMessage(message) {
  showMessage(message, 'success');
}

function showErrorMessage(message) {
  showMessage(message, 'error');
}

function showInfoMessage(message) {
  showMessage(message, 'info');
}

function showAddConfirmation(movieName) {
  showSuccessMessage(`"${movieName}" has been added successfully!`);
}

function showDeleteConfirmation(movieName) {
  showSuccessMessage(`"${movieName}" has been deleted successfully!`);
}

function showUpdateConfirmation(movieName) {
  showSuccessMessage(`"${movieName}" has been updated successfully!`);
}