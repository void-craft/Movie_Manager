import { deleteMovieById, getMovie } from './services.js';

// Toggle the delete movie section
window.toggleDeleteMovieSection = function () {
  const addMovieSection = document.getElementById('addMovieSection');
  const editMovieSection = document.getElementById('editMovieSection');
  const deleteMovieSection = document.getElementById('deleteMovieSection');

  addMovieSection?.classList.remove('expanded');
  editMovieSection?.classList.remove('expanded');
  deleteMovieSection.classList.toggle('expanded');
  setDeleteMovieState('search'); // Reset to search state when toggling
};

// Set the state of the delete movie section
function setDeleteMovieState(state) {
  const heading = document.getElementById('deleteMovieHeading');
  const searchForm = document.getElementById('deleteMovieForm');
  const searchResults = document.getElementById('deleteSearchResults');
  const confirmSection = document.getElementById('deleteConfirmation');

  if (state === 'search') {
    heading.textContent = 'Search for a Movie to Delete';
    searchForm.style.display = 'flex';
    searchResults.style.display = 'none';
    confirmSection.style.display = 'none';
  } else if (state === 'results') {
    heading.textContent = 'Search Results';
    searchForm.style.display = 'none';
    searchResults.style.display = 'block';
    confirmSection.style.display = 'none';
  } else if (state === 'confirm') {
    heading.textContent = 'Confirm Movie Deletion';
    searchForm.style.display = 'none';
    searchResults.style.display = 'none';
    confirmSection.style.display = 'block';
  }
}

// Clear the delete movie fields
function clearDeleteMovieFields() {
  document.getElementById('deleteMovieForm').reset();
  document.getElementById('deleteMovieId').value = '';
  setDeleteMovieState('search');
  handleSearchButtonVisibility(); // Update search button visibility
}

// Handle search button visibility based on form input
function handleSearchButtonVisibility() {
  const form = document.getElementById('deleteMovieForm');
  const searchButton = document.getElementById('deleteSearchButton');
  const clearButton = document.getElementById('deleteClearButton');

  const hasInput = Array.from(form.elements).some(
    (element) => element.value && element.type !== 'hidden'
  );

  searchButton.style.display = hasInput ? 'inline-block' : 'none';
  clearButton.style.display = hasInput ? 'inline-block' : 'none';
}

// Handle movie search
function handleDeleteMovieSearch(event) {
  event.preventDefault();

  const form = document.getElementById('deleteMovieForm');
  const searchCriteria = {
    name: form.querySelector('#deleteMovieName').value,
    year: form.querySelector('#deleteMovieYear').value,
    director: form.querySelector('#deleteMovieDirector').value,
    genre: form.querySelector('#deleteMovieGenre').value,
    id: form.querySelector('#deleteMovieIdSearch').value,
  };

  const filteredCriteria = Object.fromEntries(
    Object.entries(searchCriteria).filter(([_, value]) => value)
  );

  if (Object.keys(filteredCriteria).length === 0) {
    showErrorMessage('Please enter at least one search field.');
    return;
  }

  getMovie(filteredCriteria)
    .then((movies) => {
      if (movies.length === 0) {
        showInfoMessage('No movies found matching the search criteria.');
      } else if (movies.length === 1) {
        showDeleteConfirmation(movies[0]);
        setDeleteMovieState('confirm');
      } else {
        showDeleteSearchResults(movies);
      }
    })
    .catch((error) => {
      showErrorMessage(`Error searching for movies: ${error.message}`);
    });
}

// Show search results in a list
function showDeleteSearchResults(movies) {
  const searchResultsList = document.getElementById('deleteSearchResultsList');
  searchResultsList.innerHTML = '';

  movies.forEach((movie) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${movie.name} (${movie.year}) - ${movie.director}`;
    listItem.addEventListener('click', () => {
      showDeleteConfirmation(movie);
      setDeleteMovieState('confirm');
    });
    searchResultsList.appendChild(listItem);
  });

  setDeleteMovieState('results');
}

// Show confirmation section with movie details
function showDeleteConfirmation(movie) {
  const confirmSection = document.getElementById('deleteConfirmation');
  const movieDetails = document.getElementById('deleteMovieDetails');
  const deleteMovieIdField = document.getElementById('deleteMovieConfirmId');

  movieDetails.innerHTML = `
    <p><strong>Name:</strong> ${movie.name}</p>
    <p><strong>Year:</strong> ${movie.year}</p>
    <p><strong>Director:</strong> ${movie.director}</p>
    <p><strong>Genre:</strong> ${movie.genre}</p>
    <p><strong>ID:</strong> ${movie.id}</p>
  `;

  deleteMovieIdField.value = movie.id;
  setDeleteMovieState('confirm');
}

// Handle movie deletion
function handleDeleteMovie() {
  const movieId = document.getElementById('deleteMovieConfirmId').value;

  if (!movieId) {
    showErrorMessage('No movie selected. Please search for a movie first.');
    return;
  }

  deleteMovieById(movieId)
    .then(() => {
      showSuccessMessage('Movie has been deleted successfully!');
      setDeleteMovieState('search');
      clearDeleteMovieFields();
      showMovies(); // Refresh the movie list
    })
    .catch((error) => {
      showErrorMessage(`Error deleting movie: ${error.message}`);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const deleteMovieForm = document.getElementById('deleteMovieForm');
  const deleteClearButton = document.getElementById('deleteClearButton');
  const deleteSearchButton = document.getElementById('deleteSearchButton');
  const deleteButton = document.getElementById('deleteButton');
  const cancelDeleteResultsButton = document.getElementById('cancelDeleteResultsButton');
  const cancelDeleteConfirmButton = document.getElementById('cancelDeleteConfirmButton');
  const cancelDeleteButton = document.getElementById('deleteCancelButton');

  // Add input event listeners to show/hide the search button
  const searchInputs = deleteMovieForm.querySelectorAll('input[type="text"], input[type="number"]');
  searchInputs.forEach((input) => {
    input.addEventListener('input', handleSearchButtonVisibility);
  });

  if (deleteMovieForm) {
    deleteMovieForm.addEventListener('submit', handleDeleteMovieSearch);
  }

  if (deleteClearButton) {
    deleteClearButton.addEventListener('click', clearDeleteMovieFields);
  }

  if (deleteSearchButton) {
    deleteSearchButton.addEventListener('click', handleDeleteMovieSearch);
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', handleDeleteMovie);
  }

  if (cancelDeleteResultsButton) {
    cancelDeleteResultsButton.addEventListener('click', () => {
      setDeleteMovieState('search');
    });
  }

  if (cancelDeleteConfirmButton) {
    cancelDeleteConfirmButton.addEventListener('click', () => {
      setDeleteMovieState('search');
    });
  }

  if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener('click', () => {
      toggleDeleteMovieSection(false);
      clearDeleteMovieFields();
    });
  }
});