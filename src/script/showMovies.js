async function showMovies() {
  try {
    const existingMessages = document.getElementById('notificationMessage');
    if (existingMessages) {
      existingMessages.remove();
    }

    showInfoMessage('Loading movies...');

    let movies = await getMovies();

    const loadingMessage = document.getElementById('notificationMessage');
    if (loadingMessage) {
      loadingMessage.remove();
    }

    if (!movies || movies.length === 0) {
      showInfoMessage('No movies found in the database.');
      return;
    }

    document.querySelector('.movies table')?.remove();

    let table = document.createElement('table');
    table.className = 'movie-table';

    let headerRow = document.createElement('tr');

    const moviesSection = document.querySelector('.movies');
    moviesSection.appendChild(table);
    table.appendChild(headerRow);

    let selectAllHeader = document.createElement('th');
    let selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.className = 'select-all-checkbox';
    selectAllCheckbox.addEventListener('change', function () {
      const checkboxes = document.querySelectorAll('.movie-select-checkbox');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
      updateBulkDeleteButton();
    });
    selectAllHeader.appendChild(selectAllCheckbox);
    headerRow.appendChild(selectAllHeader);

    let keys = Object.keys(movies[0]);
    keys.forEach((key) => {
      let th = document.createElement('th');
      th.textContent = formatColumnName(key);
      headerRow.appendChild(th);
    });

    if (!keys.includes('actions')) {
      let actionsHeader = document.createElement('th');
      actionsHeader.textContent = 'Actions';
      headerRow.appendChild(actionsHeader);
    }

    movies.forEach((movie) => {
      let row = document.createElement('tr');

      let checkboxCell = document.createElement('td');
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'movie-select-checkbox';
      checkbox.dataset.movieId = movie.id;
      checkbox.dataset.movieName = movie.name;
      checkbox.addEventListener('change', updateBulkDeleteButton);
      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);

      keys.forEach((key) => {
        let td = document.createElement('td');
        td.textContent = movie[key] ?? 'N/A';
        row.appendChild(td);
      });

      let actionsCell = document.createElement('td');
      actionsCell.className = 'actions-cell';

      let editBtn = document.createElement('button');
      editBtn.innerHTML = '<i class="fa fa-edit"></i>';
      editBtn.className = 'action-btn edit-btn';
      editBtn.title = 'Edit';
      editBtn.onclick = () => showEditMovieForm(movie);

      let deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
      deleteBtn.className = 'action-btn delete-btn';
      deleteBtn.title = 'Delete';
      deleteBtn.onclick = () => confirmDelete([movie]);

      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      row.appendChild(actionsCell);

      table.appendChild(row);
    });

    let bulkDeleteContainer = document.getElementById('bulkDeleteContainer');
    if (!bulkDeleteContainer) {
      bulkDeleteContainer = document.createElement('div');
      bulkDeleteContainer.id = 'bulkDeleteContainer';
      bulkDeleteContainer.className = 'bulk-delete-container';
      document.querySelector('.movies').appendChild(bulkDeleteContainer);
    } else {
      bulkDeleteContainer.innerHTML = '';
    }

    const bulkDeleteBtn = document.createElement('button');
    bulkDeleteBtn.id = 'bulkDeleteButton';
    bulkDeleteBtn.innerHTML = '<i class="fa fa-trash"></i> Delete Selected';
    bulkDeleteBtn.className = 'bulk-delete-btn';
    bulkDeleteBtn.style.display = 'none';
    bulkDeleteBtn.onclick = () => {
      const selectedCheckboxes = document.querySelectorAll('.movie-select-checkbox:checked');
      const selectedMovies = Array.from(selectedCheckboxes).map((checkbox) => ({
        id: checkbox.dataset.movieId,
        name: checkbox.dataset.movieName || `Movie #${checkbox.dataset.movieId}`,
      }));
      confirmDelete(selectedMovies);
    };
    bulkDeleteContainer.appendChild(bulkDeleteBtn);

    showSuccessMessage(`${movies.length} movies loaded successfully`);

    initializeSearch();
  } catch (error) {
    showErrorMessage(`Error displaying movies: ${error.message}`);
    console.error('Error displaying the movies:', error);
  }
}

showMovies();

function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.movie-table tr:not(:first-child)');

    rows.forEach((row) => {
      const textContent = row.textContent.toLowerCase();
      if (textContent.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

function updateBulkDeleteButton() {
  const selectedCheckboxes = document.querySelectorAll('.movie-select-checkbox:checked');
  const bulkDeleteBtn = document.getElementById('bulkDeleteButton');

  if (bulkDeleteBtn) {
    if (selectedCheckboxes.length > 0) {
      bulkDeleteBtn.style.display = 'block';
      bulkDeleteBtn.textContent = `Delete Selected (${selectedCheckboxes.length})`;
    } else {
      bulkDeleteBtn.style.display = 'none';
    }
  }
}

// Reuse the delete section for confirmation
function confirmDelete(movies) {
  if (movies.length === 0) {
    showInfoMessage('No movies selected for deletion.');
    return;
  }

  // Open the delete section
  toggleDeleteMovieSection(true);

  // Show the confirmation UI
  setDeleteMovieState('confirm');

  // Populate the confirmation section with movie details
  const confirmSection = document.getElementById('deleteConfirmation');
  const movieDetails = document.getElementById('deleteMovieDetails');
  const deleteMovieIdField = document.getElementById('deleteMovieConfirmId');

  if (movies.length === 1) {
    const movie = movies[0];
    movieDetails.innerHTML = `
      <p><strong>Name:</strong> ${movie.name}</p>
      <p><strong>Year:</strong> ${movie.year}</p>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p><strong>Genre:</strong> ${movie.genre}</p>
      <p><strong>ID:</strong> ${movie.id}</p>
    `;
    deleteMovieIdField.value = movie.id;
  } else {
    movieDetails.innerHTML = `<p>You've selected ${movies.length} movies for deletion.</p>`;
  }

  // Handle the delete button click
  const deleteButton = document.getElementById('deleteButton');
  deleteButton.onclick = async () => {
    try {
      showInfoMessage('Deleting selected movies...');

      const results = [];
      for (const movie of movies) {
        try {
          await deleteMovieById(movie.id);
          results.push({ id: movie.id, success: true });
        } catch (error) {
          results.push({ id: movie.id, success: false, error: error.message });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (failureCount === 0) {
        showSuccessMessage(`Successfully deleted ${successCount} movie${successCount > 1 ? 's' : ''}`);
      } else {
        showInfoMessage(`Deleted ${successCount} movie${successCount > 1 ? 's' : ''}, ${failureCount} failed`);
      }

      // Reset the delete section
      setDeleteMovieState('search');
      clearDeleteMovieFields();
      toggleDeleteMovieSection(false);

      // Refresh the movie list
      showMovies();
    } catch (error) {
      showErrorMessage(`Error during deletion: ${error.message}`);
    }
  };
}