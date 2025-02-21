// Function to toggle the Add Movie section
function toggleAddMovieSection() {
  const addMovieSection = document.getElementById('addMovieSection');
  const editMovieSection = document.getElementById('editMovieSection');
  const deleteMovieSection = document.getElementById('deleteMovieSection');

  // Collapse other sections
  editMovieSection?.classList.remove('expanded');
  deleteMovieSection?.classList.remove('expanded');

  // Toggle Add Movie section
  addMovieSection.classList.toggle('expanded');
}

// Function to handle form submission
function handleAddMovieFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const movie = {
    name: form.querySelector('input[placeholder="Enter movie name"]').value,
    year: parseInt(form.querySelector('input[placeholder="Enter release year"]').value),
    director: form.querySelector('input[placeholder="Enter director name"]').value,
    genre: form.querySelector('input[placeholder="Enter genre"]').value,
  };

  // Add movie to the database
  postMovie(movie)
    .then(() => {
      showSuccessMessage(`"${movie.name}" has been added successfully!`);
      toggleAddMovieSection(); // Collapse the form
      showMovies(); // Refresh the movie list
    })
    .catch((error) => {
      showErrorMessage(`Error adding movie: ${error.message}`);
    });
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  const addMovieForm = document.getElementById('addMovieForm');
  if (addMovieForm) {
    addMovieForm.addEventListener('submit', handleAddMovieFormSubmit);
  }
});