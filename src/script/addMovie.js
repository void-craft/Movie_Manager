import { postMovie } from './services.js';

window.toggleAddMovieSection = function () {
  const addMovieSection = document.getElementById('addMovieSection');
  const editMovieSection = document.getElementById('editMovieSection');
  const deleteMovieSection = document.getElementById('deleteMovieSection');

  editMovieSection?.classList.remove('expanded');
  deleteMovieSection?.classList.remove('expanded');
  addMovieSection.classList.toggle('expanded');
};

function handleAddMovieFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const movie = {
    name: form.querySelector('input[placeholder="Enter movie name"]').value,
    year: parseInt(
      form.querySelector('input[placeholder="Enter release year"]').value
    ),
    director: form.querySelector('input[placeholder="Enter director name"]')
      .value,
    genre: form.querySelector('input[placeholder="Enter genre"]').value,
  };

  postMovie(movie)
    .then(() => {
      showSuccessMessage(`"${movie.name}" has been added successfully!`);
      toggleAddMovieSection();
      showMovies();
    })
    .catch((error) => {
      showErrorMessage(`Error adding movie: ${error.message}`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const addMovieForm = document.getElementById('addMovieForm');
  if (addMovieForm) {
    addMovieForm.addEventListener('submit', handleAddMovieFormSubmit);
  }
});
