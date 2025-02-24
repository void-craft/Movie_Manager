import { getMovie, putMovie } from './services.js';
import { showMovies } from './showMovies.js';

// Toggle the edit movie section
window.toggleEditMovieSection = function () {
  const addMovieSection = document.getElementById('addMovieSection');
  const editMovieSection = document.getElementById('editMovieSection');
  const deleteMovieSection = document.getElementById('deleteMovieSection');

  addMovieSection?.classList.remove('expanded');
  deleteMovieSection?.classList.remove('expanded');
  editMovieSection.classList.toggle('expanded');
};

// Handle search button visibility based on form input
function handleSearchButtonVisibility() {
  const form = document.getElementById('editMovieForm');
  const searchButton = document.getElementById('searchButton');
  const clearButton = document.getElementById('clearButton');

  const hasInput = Array.from(form.elements).some(
    (element) => element.value && element.type !== 'hidden'
  );

  searchButton.style.display = hasInput ? 'inline-block' : 'none';
  clearButton.style.display = hasInput ? 'inline-block' : 'none';
}

// Handle movie search
function handleEditMovieSearch(event) {
  event.preventDefault();

  const form = document.getElementById('editMovieForm');
  const searchCriteria = {
    name: form.querySelector('#editMovieName').value,
    year: form.querySelector('#editMovieYear').value,
    director: form.querySelector('#editMovieDirector').value,
    genre: form.querySelector('#editMovieGenre').value,
    id: form.querySelector('#editMovieIdSearch').value,
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
        populateEditForm(movies[0]);
        setEditMovieState('edit');
      } else {
        showSearchResults(movies);
      }
    })
    .catch((error) => {
      showErrorMessage(`Error searching for movies: ${error.message}`);
    });
}

// Show search results in a list
function showSearchResults(movies) {
  const searchResultsList = document.getElementById('searchResultsList');
  searchResultsList.innerHTML = '';

  movies.forEach((movie) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${movie.name} (${movie.year}) - ${movie.director}`;
    listItem.addEventListener('click', () => {
      populateEditForm(movie);
      setEditMovieState('edit');
    });
    searchResultsList.appendChild(listItem);
  });

  setEditMovieState('results');
}

// Populate the edit form with movie details
function populateEditForm(movie) {
  const editForm = document.getElementById('editMovieEditForm');
  editForm.querySelector('#editMovieEditId').value = movie.id;
  editForm.querySelector('#editMovieEditName').value = movie.name;
  editForm.querySelector('#editMovieEditYear').value = movie.year;
  editForm.querySelector('#editMovieEditDirector').value = movie.director;
  editForm.querySelector('#editMovieEditGenre').value = movie.genre;

  editForm.dataset.originalMovie = JSON.stringify(movie);

  const saveButton = document.getElementById('saveButton');
  saveButton.style.display = 'none';

  const formFields = editForm.querySelectorAll('input[type="text"], input[type="number"]');
  formFields.forEach((field) => {
    field.addEventListener('input', () => {
      const originalMovie = JSON.parse(editForm.dataset.originalMovie);
      const isModified = isFormModified(originalMovie, editForm);
      saveButton.style.display = isModified ? 'inline-block' : 'none';
    });
  });

  setEditMovieState('edit');
}

// Check if the form has been modified
function isFormModified(originalMovie, currentForm) {
  return (
    originalMovie.name !== currentForm.querySelector('#editMovieEditName').value ||
    originalMovie.year !== parseInt(currentForm.querySelector('#editMovieEditYear').value) ||
    originalMovie.director !== currentForm.querySelector('#editMovieEditDirector').value ||
    originalMovie.genre !== currentForm.querySelector('#editMovieEditGenre').value
  );
}

// Handle saving the edited movie
function handleEditMovieSave() {
  const editForm = document.getElementById('editMovieEditForm');
  const updatedMovie = {
    id: editForm.querySelector('#editMovieEditId').value,
    name: editForm.querySelector('#editMovieEditName').value,
    year: parseInt(editForm.querySelector('#editMovieEditYear').value),
    director: editForm.querySelector('#editMovieEditDirector').value,
    genre: editForm.querySelector('#editMovieEditGenre').value,
  };

  if (!updatedMovie.id) {
    showErrorMessage('No movie selected. Please search for a movie first.');
    return;
  }

  putMovie(updatedMovie)
    .then(() => {
      showSuccessMessage(`"${updatedMovie.name}" has been updated successfully!`);
      editForm.dataset.originalMovie = JSON.stringify(updatedMovie);
      document.getElementById('saveButton').style.display = 'none';
      showMovies();
    })
    .catch((error) => {
      showErrorMessage(`Error updating movie: ${error.message}`);
    });
}

// Set the state of the edit movie section
function setEditMovieState(state) {
  const heading = document.getElementById('editMovieHeading');
  const searchForm = document.getElementById('editMovieForm');
  const searchResults = document.getElementById('searchResults');
  const editForm = document.getElementById('editMovieEditForm');

  if (state === 'search') {
    heading.textContent = 'Search for a Movie to Edit';
    searchForm.style.display = 'flex';
    searchResults.style.display = 'none';
    editForm.style.display = 'none';
  } else if (state === 'results') {
    heading.textContent = 'Search Results';
    searchForm.style.display = 'none';
    searchResults.style.display = 'block';
    editForm.style.display = 'none';
  } else if (state === 'edit') {
    heading.textContent = 'Edit Movie Details';
    searchForm.style.display = 'none';
    searchResults.style.display = 'none';
    editForm.style.display = 'flex';
  }
}

// Clear the edit movie fields
function clearEditMovieFields() {
  document.getElementById('editMovieForm').reset();
  document.getElementById('editMovieEditForm').reset();
  document.getElementById('editMovieId').value = '';
  document.getElementById('editMovieEditId').value = '';
  setEditMovieState('search');
  handleSearchButtonVisibility();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const editMovieForm = document.getElementById('editMovieForm');
  const cancelButton = document.getElementById('cancelButton');
  const clearButton = document.getElementById('clearButton');
  const searchButton = document.getElementById('searchButton');
  const saveButton = document.getElementById('saveButton');
  const cancelResultsButton = document.getElementById('cancelResultsButton');
  const cancelEditButton = document.getElementById('cancelEditButton');

  // Add input event listeners to show/hide the search button
  const searchInputs = editMovieForm.querySelectorAll('input[type="text"], input[type="number"]');
  searchInputs.forEach((input) => {
    input.addEventListener('input', handleSearchButtonVisibility);
  });

  if (editMovieForm) {
    editMovieForm.addEventListener('submit', handleEditMovieSearch);
  }

  if (clearButton) {
    clearButton.addEventListener('click', clearEditMovieFields);
  }

  if (searchButton) {
    searchButton.addEventListener('click', handleEditMovieSearch);
  }

  if (saveButton) {
    saveButton.addEventListener('click', handleEditMovieSave);
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      toggleEditMovieSection(false);
      clearEditMovieFields();
    });
  }

  if (cancelResultsButton) {
    cancelResultsButton.addEventListener('click', () => {
      setEditMovieState('search');
    });
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', () => {
      setEditMovieState('search');
    });
  }
});