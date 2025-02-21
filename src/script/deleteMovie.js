// Function to toggle the Delete Movie section visibility
function toggleDeleteMovieSection() {
  const addMovieSection = document.getElementById('addMovieSection');
  const editMovieSection = document.getElementById('editMovieSection');
  const deleteMovieSection = document.getElementById('deleteMovieSection');
  const deleteSearchButton = document.getElementById('deleteSearchButton');
  const deleteClearButton = document.getElementById('deleteClearButton');
  const deleteCancelButton = document.getElementById('deleteCancelButton');

  // Collapse other sections
  addMovieSection?.classList.remove('expanded');
  editMovieSection?.classList.remove('expanded');

  // Toggle Delete Movie section
  const isExpanded = deleteMovieSection.classList.toggle('expanded');
  
  if (isExpanded) {
    // Reset fields and UI
    clearDeleteMovieFields();
    setDeleteMovieState('search'); // Default to search state
    hideDeleteSearchResults();
    hideDeleteConfirmation();
    
    // Show search and clear buttons
    deleteSearchButton.style.display = 'inline-block';
    deleteClearButton.style.display = 'inline-block';
    deleteCancelButton.style.display = 'inline-block';
  }
}

// Function to clear all fields in the Delete Movie section
function clearDeleteMovieFields() {
  document.getElementById('deleteMovieForm').reset();
  document.getElementById('deleteMovieId').value = ''; // Clear hidden ID field
}

// Function to set the Delete Movie section state (search, results, or confirm)
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

// Function to show search results
function showDeleteSearchResults(movies) {
  const searchResultsList = document.getElementById('deleteSearchResultsList');

  // Clear previous results
  searchResultsList.innerHTML = '';

  // Add new results
  movies.forEach((movie) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${movie.name} (${movie.year}) - ${movie.director}`;
    listItem.addEventListener('click', () => {
      showDeleteConfirmation(movie);
      setDeleteMovieState('confirm');
    });
    searchResultsList.appendChild(listItem);
  });

  // Show the results container
  setDeleteMovieState('results');
}

// Function to hide search results
function hideDeleteSearchResults() {
  const searchResults = document.getElementById('deleteSearchResults');
  searchResults.style.display = 'none';
}

// Function to show delete confirmation
function showDeleteConfirmation(movie) {
  const confirmSection = document.getElementById('deleteConfirmation');
  const movieDetails = document.getElementById('deleteMovieDetails');
  const deleteMovieIdField = document.getElementById('deleteMovieConfirmId');
  
  // Display movie details
  movieDetails.innerHTML = `
    <p><strong>Name:</strong> ${movie.name}</p>
    <p><strong>Year:</strong> ${movie.year}</p>
    <p><strong>Director:</strong> ${movie.director}</p>
    <p><strong>Genre:</strong> ${movie.genre}</p>
    <p><strong>ID:</strong> ${movie.id}</p>
  `;
  
  // Set the movie ID in the hidden field
  deleteMovieIdField.value = movie.id;
  
  // Show the confirmation section
  confirmSection.style.display = 'block';
}

// Function to hide delete confirmation
function hideDeleteConfirmation() {
  const confirmSection = document.getElementById('deleteConfirmation');
  confirmSection.style.display = 'none';
}

// Function to handle search for deletion
function handleDeleteMovieSearch() {
  const form = document.getElementById('deleteMovieForm');
  const searchCriteria = {
    name: form.querySelector('#deleteMovieName').value,
    year: form.querySelector('#deleteMovieYear').value,
    director: form.querySelector('#deleteMovieDirector').value,
    genre: form.querySelector('#deleteMovieGenre').value,
    id: form.querySelector('#deleteMovieIdSearch').value,
  };

  // Remove empty fields from the search criteria
  const filteredCriteria = Object.fromEntries(
    Object.entries(searchCriteria).filter(([_, value]) => value)
  );

  if (Object.keys(filteredCriteria).length === 0) {
    showErrorMessage('Please enter at least one search field.');
    return;
  }

  findMovieByCriteria(filteredCriteria)
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

// Function to handle movie deletion
function handleDeleteMovie() {
  const movieId = document.getElementById('deleteMovieConfirmId').value;

  if (!movieId) {
    showErrorMessage('No movie selected. Please search for a movie first.');
    return;
  }

  deleteMovieById(movieId)
    .then(() => {
      showSuccessMessage('Movie has been deleted successfully!');
      // Keep the delete section expanded
      const deleteMovieSection = document.getElementById('deleteMovieSection');
      if (!deleteMovieSection.classList.contains('expanded')) {
        deleteMovieSection.classList.add('expanded');
      }
      // Reset to search state
      setDeleteMovieState('search');
      clearDeleteMovieFields();
      // Refresh the movie list
      showMovies();
    })
    .catch((error) => {
      showErrorMessage(`Error deleting movie: ${error.message}`);
    });
}

// Attach event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const deleteMovieForm = document.getElementById('deleteMovieForm');
  const deleteClearButton = document.getElementById('deleteClearButton');
  const deleteSearchButton = document.getElementById('deleteSearchButton');
  const deleteButton = document.getElementById('deleteButton');
  const cancelDeleteResultsButton = document.getElementById('cancelDeleteResultsButton');
  const cancelDeleteConfirmButton = document.getElementById('cancelDeleteConfirmButton');
  const cancelDeleteButton = document.getElementById('deleteCancelButton');

  if (deleteMovieForm) {
    deleteMovieForm.addEventListener('submit', (event) => {
      event.preventDefault();
      handleDeleteMovieSearch();
    });
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
      // Collapse the delete movie section
      const deleteMovieSection = document.getElementById('deleteMovieSection');
      deleteMovieSection.classList.remove('expanded');
      clearDeleteMovieFields();
    });
  }
});