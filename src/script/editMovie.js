document.addEventListener('DOMContentLoaded', () => {
  const editMovieForm = document.getElementById('editMovieForm');
  const cancelButton = document.getElementById('cancelButton');
  const clearButton = document.getElementById('clearButton');
  const searchButton = document.getElementById('searchButton');
  const saveButton = document.getElementById('saveButton');
  const cancelResultsButton = document.getElementById('cancelResultsButton');
  const cancelEditButton = document.getElementById('cancelEditButton');

  if (editMovieForm) {
    editMovieForm.addEventListener('submit', (event) => {
      event.preventDefault();
      handleEditMovieSearch();
    });
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
      // Collapse the edit movie section
      const editMovieSection = document.getElementById('editMovieSection');
      editMovieSection.classList.remove('expanded');
      clearEditMovieFields(); // Reset the form fields
    });
  }

  if (cancelResultsButton) {
    cancelResultsButton.addEventListener('click', () => {
      setEditMovieState('search'); // Switch back to search state
    });
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', () => {
      const editForm = document.getElementById('editMovieEditForm');
      editForm.reset(); // Reset the form
      saveButton.style.display = 'none'; // Hide the Save button
      setEditMovieState('search'); // Switch back to search state
    });
  }
});

// Remove the duplicate DOMContentLoaded block lower in the code

function toggleEditMovieSection() {
  const addMovieSection = document.getElementById('addMovieSection');
  const editMovieSection = document.getElementById('editMovieSection');
  const deleteMovieSection = document.getElementById('deleteMovieSection');
  const searchButton = document.getElementById('searchButton');
  const clearButton = document.getElementById('clearButton');
  const cancelButton = document.getElementById('cancelButton');

  // Collapse other sections
  addMovieSection?.classList.remove('expanded');
  deleteMovieSection?.classList.remove('expanded');

  // Toggle Edit Movie section
  const isExpanded = editMovieSection.classList.toggle('expanded');
  
  if (isExpanded) {
    // Reset fields and UI
    clearEditMovieFields();
    setEditMovieState('search'); // Default to search state
    hideSearchResults();
    hideEditForm();
    
    // Show search and clear buttons
    searchButton.style.display = 'inline-block';
    clearButton.style.display = 'inline-block';
    cancelButton.style.display = 'inline-block';
  }
}

// Function to clear all fields in the Edit Movie section
function clearEditMovieFields() {
  document.getElementById('editMovieForm').reset();
  document.getElementById('editMovieEditForm').reset();
  document.getElementById('editMovieId').value = ''; // Clear hidden ID field
  document.getElementById('editMovieEditId').value = ''; // Clear hidden ID field
}

// Function to set the Edit Movie section state (search, results, or edit)
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

// Function to show search results
function showSearchResults(movies) {
  const searchResultsList = document.getElementById('searchResultsList');

  // Clear previous results
  searchResultsList.innerHTML = '';

  // Add new results
  movies.forEach((movie) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${movie.name} (${movie.year}) - ${movie.director}`;
    listItem.addEventListener('click', () => {
      populateEditForm(movie);
      setEditMovieState('edit');
    });
    searchResultsList.appendChild(listItem);
  });

  // Show the results container
  setEditMovieState('results');
}

// Function to hide search results
function hideSearchResults() {
  const searchResults = document.getElementById('searchResults');
  searchResults.style.display = 'none';
}

// Function to hide edit form
function hideEditForm() {
  const editForm = document.getElementById('editMovieEditForm');
  editForm.style.display = 'none';
}

// Function to handle search
function handleEditMovieSearch() {
  const form = document.getElementById('editMovieForm');
  const searchCriteria = {
    name: form.querySelector('#editMovieName').value,
    year: form.querySelector('#editMovieYear').value,
    director: form.querySelector('#editMovieDirector').value,
    genre: form.querySelector('#editMovieGenre').value,
    id: form.querySelector('#editMovieIdSearch').value,
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
        populateEditForm(movies[0]);
        setEditMovieState('edit'); // Switch to edit state
      } else {
        showSearchResults(movies); // Show results in the collapsible section
      }
    })
    .catch((error) => {
      showErrorMessage(`Error searching for movies: ${error.message}`);
    });
}

// Function to find movies by any criteria
async function findMovieByCriteria(criteria) {
  try {
    const response = await fetch('http://localhost:3000/movies');
    if (!response.ok) {
      throw new Error(
        `Failed to fetch movies. Server returned ${response.status}`
      );
    }
    const movies = await response.json();

    // Filter movies based on the search criteria
    return movies.filter((movie) => {
      return Object.entries(criteria).every(([key, value]) => {
        return String(movie[key])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
  } catch (error) {
    throw error;
  }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  const editMovieForm = document.getElementById('editMovieForm');
  const clearButton = document.getElementById('clearButton');
  const searchButton = document.getElementById('searchButton');
  const saveButton = document.getElementById('saveButton');
  const cancelResultsButton = document.getElementById('cancelResultsButton');
  const cancelEditButton = document.getElementById('cancelEditButton');

  if (editMovieForm) {
    editMovieForm.addEventListener('submit', (event) => {
      event.preventDefault();
      handleEditMovieSearch();
    });
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

  if (cancelResultsButton) {
    cancelResultsButton.addEventListener('click', () => {
      setEditMovieState('search'); // Switch back to search state
    });
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', () => {
      setEditMovieState('search'); // Switch back to search state
    });
  }
});

// Function to check if the form has been modified
function isFormModified(originalMovie, currentForm) {
  return (
    originalMovie.name !==
      currentForm.querySelector('#editMovieEditName').value ||
    originalMovie.year !==
      parseInt(currentForm.querySelector('#editMovieEditYear').value) ||
    originalMovie.director !==
      currentForm.querySelector('#editMovieEditDirector').value ||
    originalMovie.genre !==
      currentForm.querySelector('#editMovieEditGenre').value
  );
}

// Function to populate the edit form with movie details
function populateEditForm(movie) {
  const editForm = document.getElementById('editMovieEditForm');
  editForm.querySelector('#editMovieEditId').value = movie.id;
  editForm.querySelector('#editMovieEditName').value = movie.name;
  editForm.querySelector('#editMovieEditYear').value = movie.year;
  editForm.querySelector('#editMovieEditDirector').value = movie.director;
  editForm.querySelector('#editMovieEditGenre').value = movie.genre;

  // Store the original movie details for comparison
  editForm.dataset.originalMovie = JSON.stringify(movie);

  // Hide the Save button initially
  const saveButton = document.getElementById('saveButton');
  saveButton.style.display = 'none';

  // Add event listeners to form fields to track changes
  const formFields = editForm.querySelectorAll(
    'input[type="text"], input[type="number"]'
  );
  formFields.forEach((field) => {
    field.addEventListener('input', () => {
      const originalMovie = JSON.parse(editForm.dataset.originalMovie);
      const isModified = isFormModified(originalMovie, editForm);
      saveButton.style.display = isModified ? 'inline-block' : 'none';
    });
  });

  // Show the edit form
  setEditMovieState('edit');
}

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

  updateMovie(updatedMovie)
    .then(() => {
      // Don't reset the form or change edit state
      showSuccessMessage(
        `"${updatedMovie.name}" has been updated successfully!`
      );
      
      // Make sure edit section stays expanded
      const editMovieSection = document.getElementById('editMovieSection');
      if (!editMovieSection.classList.contains('expanded')) {
        editMovieSection.classList.add('expanded');
      }
      
      // Keep the form in edit state
      setEditMovieState('edit');
      
      // Update the original movie data to match the new values
      editForm.dataset.originalMovie = JSON.stringify(updatedMovie);
      
      // Hide the save button since form now matches saved data
      document.getElementById('saveButton').style.display = 'none';
      
      // Refresh movie list in background
      showMovies();
    })
    .catch((error) => {
      showErrorMessage(`Error updating movie: ${error.message}`);
    });
}
