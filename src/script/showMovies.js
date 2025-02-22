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

// Combined function for single and bulk deletion
function confirmDelete(movies) {
  if (movies.length === 0) {
    showInfoMessage('No movies selected for deletion.');
    return;
  }

  const { popup, popupContent } = createPopup('confirmDeletePopup', movies.length > 1 ? 'Confirm Multiple Deletion' : 'Confirm Delete');

  const messageDiv = document.createElement('div');
  messageDiv.className = 'confirm-message';

  let message = `<p>Are you sure you want to delete ${movies.length} movie(s)?</p>`;

  if (movies.length <= 10) {
    message += '<ul>';
    movies.forEach((movie) => {
      message += `<li>"${movie.name}"</li>`;
    });
    message += '</ul>';
  } else {
    message += `<p>You've selected ${movies.length} movies for deletion.</p>`;
  }

  message += '<p><strong>This action cannot be undone.</strong></p>';
  messageDiv.innerHTML = message;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'button-container';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = `Delete ${movies.length} Movie${movies.length > 1 ? 's' : ''}`;
  deleteButton.className = 'delete-btn';
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

      closePopup('confirmDeletePopup');

      if (failureCount === 0) {
        showSuccessMessage(`Successfully deleted ${successCount} movie${successCount > 1 ? 's' : ''}`);
      } else {
        showInfoMessage(`Deleted ${successCount} movie${successCount > 1 ? 's' : ''}, ${failureCount} failed`);
      }

      // Uncheck all checkboxes after bulk deletion
      const checkboxes = document.querySelectorAll('.movie-select-checkbox:checked');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      updateBulkDeleteButton();

      showMovies();
    } catch (error) {
      showErrorMessage(`Error during deletion: ${error.message}`);
    }
  };

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-btn';
  cancelButton.onclick = () => {
    closePopup('confirmDeletePopup');
    if (movies.length > 1) {
      // Uncheck all checkboxes if it's a bulk deletion
      const checkboxes = document.querySelectorAll('.movie-select-checkbox:checked');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      updateBulkDeleteButton();
    }
  };

  buttonsContainer.appendChild(deleteButton);
  buttonsContainer.appendChild(cancelButton);

  popupContent.appendChild(messageDiv);
  popupContent.appendChild(buttonsContainer);
}