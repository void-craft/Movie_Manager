/* ---------------------------- DISPLAY ALL MOVIES ON HTML ---------------------------- */
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

    // Remove existing table if it exists
    document.querySelector('.movies table')?.remove();

    let table = document.createElement('table');
    table.className = 'movie-table';
    
    let headerRow = document.createElement('tr');

    // Append the table to the movies
    const moviesSection = document.querySelector('.movies');
    moviesSection.appendChild(table);
    table.appendChild(headerRow);
    
    let selectAllHeader = document.createElement('th');
    let selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.className = 'select-all-checkbox';
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.movie-select-checkbox');
      checkboxes.forEach(checkbox => {
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
      deleteBtn.onclick = () => confirmDeleteMovie(movie);
      
      // Add buttons to cell
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      row.appendChild(actionsCell);
      
      // Add row to table
      table.appendChild(row);
    });
    
    // Create bulk delete button container if it doesn't exist
    let bulkDeleteContainer = document.getElementById('bulkDeleteContainer');
    if (!bulkDeleteContainer) {
      bulkDeleteContainer = document.createElement('div');
      bulkDeleteContainer.id = 'bulkDeleteContainer';
      bulkDeleteContainer.className = 'bulk-delete-container';
      document.querySelector('.movies').appendChild(bulkDeleteContainer);
    } else {
      bulkDeleteContainer.innerHTML = '';
    }
    
    // Create the bulk delete button (initially hidden)
    const bulkDeleteBtn = document.createElement('button');
    bulkDeleteBtn.id = 'bulkDeleteButton';
    bulkDeleteBtn.innerHTML = '<i class="fa fa-trash"></i> Delete Selected';
    bulkDeleteBtn.className = 'bulk-delete-btn';
    bulkDeleteBtn.style.display = 'none';
    bulkDeleteBtn.onclick = confirmDeleteMultipleMovies;
    bulkDeleteContainer.appendChild(bulkDeleteBtn);
    
    // Add a small success message
    showSuccessMessage(`${movies.length} movies loaded successfully`);
    
    // Initialize search functionality
    initializeSearch();
    
  } catch (error) {
    showErrorMessage(`Error displaying movies: ${error.message}`);
    console.error('Error displaying the movies:', error);
  }
}

showMovies();

// Initialize search functionality
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

// Update bulk delete button visibility based on selections
function updateBulkDeleteButton() {
  const selectedCheckboxes = document.querySelectorAll(
    '.movie-select-checkbox:checked'
  );
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

// Confirm deletion of multiple movies
function confirmDeleteMultipleMovies() {
  const selectedCheckboxes = document.querySelectorAll(
    '.movie-select-checkbox:checked'
  );

  if (selectedCheckboxes.length === 0) {
    showInfoMessage('No movies selected for deletion.');
    return;
  }

  const selectedMovies = Array.from(selectedCheckboxes).map((checkbox) => ({
    id: checkbox.dataset.movieId,
    name: checkbox.dataset.movieName || `Movie #${checkbox.dataset.movieId}`,
  }));

  const { popup, popupContent } = createPopup(
    'confirmMultiDeletePopup',
    'Confirm Multiple Deletion'
  );

  const messageDiv = document.createElement('div');
  messageDiv.className = 'confirm-message';

  let message = `<p>Are you sure you want to delete ${selectedMovies.length} movie(s)?</p>`;

  if (selectedMovies.length <= 10) {
    message += '<ul>';
    selectedMovies.forEach((movie) => {
      message += `<li>"${movie.name}"</li>`;
    });
    message += '</ul>';
  } else {
    message += `<p>You've selected ${selectedMovies.length} movies for deletion.</p>`;
  }

  message += '<p><strong>This action cannot be undone.</strong></p>';
  messageDiv.innerHTML = message;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'button-container';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = `Delete ${selectedMovies.length} Movies`;
  deleteButton.className = 'delete-btn';
  deleteButton.onclick = async () => {
    try {
      showInfoMessage('Deleting selected movies...');

      // Delete movies sequentially
      const results = [];
      for (const movie of selectedMovies) {
        try {
          await deleteMovieById(movie.id);
          results.push({ id: movie.id, success: true });
        } catch (error) {
          results.push({ id: movie.id, success: false, error: error.message });
        }
      }

      // Count successes and failures
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      closePopup('confirmMultiDeletePopup');

      if (failureCount === 0) {
        showSuccessMessage(`Successfully deleted ${successCount} movies`);
      } else {
        showInfoMessage(
          `Deleted ${successCount} movies, ${failureCount} failed`
        );
      }

      showMovies();
    } catch (error) {
      showErrorMessage(`Error during bulk deletion: ${error.message}`);
    }
  };

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-btn';
  cancelButton.onclick = () => closePopup('confirmMultiDeletePopup');

  buttonsContainer.appendChild(deleteButton);
  buttonsContainer.appendChild(cancelButton);

  popupContent.appendChild(messageDiv);
  popupContent.appendChild(buttonsContainer);
}

// Format column name (e.g., 'movieId' -> 'Movie ID')
function formatColumnName(name) {
  if (!name) return '';

  // Handle special cases
  if (name.toLowerCase() === 'id') return 'ID';

  // Convert camelCase to Title Case With Spaces
  return (
    name
      // Insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // Uppercase the first character
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
  );
}

// Show confirmation dialog for deleting a movie
function confirmDeleteMovie(movie) {
  const { popup, popupContent } = createPopup(
    'confirmDeletePopup',
    'Confirm Delete'
  );

  const messageDiv = document.createElement('div');
  messageDiv.className = 'confirm-message';
  messageDiv.innerHTML = `Are you sure you want to delete <strong>"${movie.name}"</strong>?<br>This action cannot be undone.`;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'button-container';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-btn';
  deleteButton.onclick = async () => {
    try {
      await deleteMovieById(movie.id);
      closePopup('confirmDeletePopup');
      showDeleteConfirmation(movie.name);
      // Refresh the movie list
      showMovies();
    } catch (error) {
      showErrorMessage(`Error: ${error.message}`);
    }
  };

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-btn';
  cancelButton.onclick = () => closePopup('confirmDeletePopup');

  buttonsContainer.appendChild(deleteButton);
  buttonsContainer.appendChild(cancelButton);

  popupContent.appendChild(messageDiv);
  popupContent.appendChild(buttonsContainer);
}
