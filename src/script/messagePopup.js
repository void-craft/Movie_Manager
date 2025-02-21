function showMessage(message, type = 'success') {
  const existingNotification = document.getElementById('notificationMessage');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'notificationMessage';
  notification.className = `notification-message ${type}-message`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Success message wrapper
function showSuccessMessage(message) {
  showMessage(message, 'success');
}

// Error message wrapper
function showErrorMessage(message) {
  showMessage(message, 'error');
}

// Info message wrapper
function showInfoMessage(message) {
  showMessage(message, 'info');
}

// movie added confirmation
function showAddConfirmation(movieName) {
  showSuccessMessage(`"${movieName}" has been added successfully!`);
}

// movie deleted confirmation
function showDeleteConfirmation(movieName) {
  showSuccessMessage(`"${movieName}" has been deleted successfully!`);
}

// movie updated confirmation
function showUpdateConfirmation(movieName) {
  showSuccessMessage(`"${movieName}" has been updated successfully!`);
}