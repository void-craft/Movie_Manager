function showPopupForm() {
  const popup = document.createElement('div');
  popup.id = 'formPopup';
  
  const form = document.createElement('form');
  form.id = 'movieForm';
  
  const fields = [
    { name: 'name', placeholder: 'Enter movie name' },
    { name: 'year', placeholder: 'Enter release year' },
    { name: 'director', placeholder: 'Enter director name' },
    { name: 'genre', placeholder: 'Enter genre' }
  ];
  
  fields.forEach(field => {
    const input = document.createElement('input');
    input.type = field.name === 'year' ? 'number' : 'text';
    input.placeholder = field.placeholder;
    input.required = true;
    form.appendChild(input);
  });
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Close';
  closeButton.onclick = closePopupForm;
  
  form.appendChild(submitButton);
  form.appendChild(closeButton);
  popup.appendChild(form);
  document.body.appendChild(popup);
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const movie = {
      name: form.querySelector('input[placeholder="Enter movie name"]').value,
      year: parseInt(form.querySelector('input[placeholder="Enter release year"]').value),
      director: form.querySelector('input[placeholder="Enter director name"]').value,
      genre: form.querySelector('input[placeholder="Enter genre"]').value
    };
    postMovie(movie);
    closePopupForm();
    showConfirmation(movie.name);
  });
}

function closePopupForm() {
  const popup = document.getElementById('formPopup');
  if (popup) {
    popup.remove();
  }
}

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

document.getElementById('addMovieButton').addEventListener('click', showPopupForm);