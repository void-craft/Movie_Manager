function showConfirmation(movieName) {
  const confirmation = document.createElement('div');
  confirmation.id = 'confirmationMessage';
  confirmation.textContent = `"${movieName}" has been added successfully!`;
  
  document.body.appendChild(confirmation);
  
  setTimeout(() => {
    const confirmationElem = document.getElementById('confirmationMessage');
    if (confirmationElem) {
      confirmationElem.classList.add('fade-out');
      setTimeout(() => confirmationElem.remove(), 500);
    }
  }, 3000);
}