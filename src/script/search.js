// Initialize search functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', async function () {
    const searchTerm = this.value.toLowerCase();

    try {
      // Fetch all movies from the API
      let movies = await getMovies();

      // Filter movies based on the search term
      const filteredMovies = movies.filter((movie) => {
        return Object.values(movie).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        );
      });

      // Display the filtered movies in the table
      displayMovies(filteredMovies);
    } catch (error) {
      showErrorMessage(`Error searching movies: ${error.message}`);
      console.error('Error searching movies:', error);
    }
  });
}

// Helper function to display movies in the table
function displayMovies(movies) {
  // Remove any existing table
  document.querySelector('table')?.remove();

  // Handle empty results
  if (!movies || movies.length === 0) {
    showInfoMessage('No movies found matching your search.');
    return;
  }

  // Create new table
  let table = document.createElement('table');
  table.className = 'movie-table';

  // Create header row
  let headerRow = document.createElement('tr');

  // Append the table to the main element
  document.getElementById('content').appendChild(table);
  table.appendChild(headerRow);

  // Get column names from first movie
  let keys = Object.keys(movies[0]);

  // Create table headers
  keys.forEach((key) => {
    let th = document.createElement('th');
    th.textContent = formatColumnName(key);
    headerRow.appendChild(th);
  });

  // Add data rows
  movies.forEach((movie) => {
    let row = document.createElement('tr');

    // Add data cells
    keys.forEach((key) => {
      let td = document.createElement('td');
      td.textContent = movie[key] ?? 'N/A';
      row.appendChild(td);
    });

    // Add row to table
    table.appendChild(row);
  });

  // Add a small success message
  showSuccessMessage(`${movies.length} movies found.`);
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