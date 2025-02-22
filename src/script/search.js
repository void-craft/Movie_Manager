function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', async function () {
    const searchTerm = this.value.toLowerCase();

    try {
      let movies = await getMovies();

      const filteredMovies = movies.filter((movie) => {
        return Object.values(movie).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        );
      });

      displayMovies(filteredMovies);
    } catch (error) {
      showErrorMessage(`Error searching movies: ${error.message}`);
      console.error('Error searching movies:', error);
    }
  });
}

function displayMovies(movies) {
  document.querySelector('table')?.remove();

  if (!movies || movies.length === 0) {
    showInfoMessage('No movies found matching your search.');
    return;
  }

  let table = document.createElement('table');
  table.className = 'movie-table';
  let headerRow = document.createElement('tr');
  document.getElementById('content').appendChild(table);
  table.appendChild(headerRow);
  let keys = Object.keys(movies[0]);

  keys.forEach((key) => {
    let th = document.createElement('th');
    th.textContent = formatColumnName(key);
    headerRow.appendChild(th);
  });

  movies.forEach((movie) => {
    let row = document.createElement('tr');

    keys.forEach((key) => {
      let td = document.createElement('td');
      td.textContent = movie[key] ?? 'N/A';
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  showSuccessMessage(`${movies.length} movies found.`);
}

function formatColumnName(name) {
  if (!name) return '';
  if (name.toLowerCase() === 'id') return 'ID';
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
}
