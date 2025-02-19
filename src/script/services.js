/* ---------------------------- ADD A MOVIE----------------------------  */
async function postMovie(movie) {
  try {
    let response = await fetch('http://localhost:3000/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    let data = await response.json();
    console.log('Movie Created:', data);
  } catch (error) {
    console.error('Error creating movie:', error);
  }
}

/* ---------------------------- GET A MOVIE ----------------------------  */
async function getMovie(movieId) {
  try {
    let response = await fetch(`http://localhost:3000/movies/${movieId}`);
    let movie = await response.json();
    console.log('Movie Requested: ', movie);
  } catch (error) {
    console.error('Error fetching the movie:', error);
  }
}

/* ---------------------------- GET ALL MOVIES ----------------------------  */
async function getMovies() {
  try {
    let response = await fetch(`http://localhost:3000/movies/`);
    let movies = await response.json();
    console.log('Here are the Movies: ', movies);
    return movies;
  } catch (error) {
    console.error('Error fetching the movies:', error);
  }
}

/* ---------------------------- DISPLAY ALL MOVIES ON HTML ----------------------------  */
async function displayMovies() {
  try {
    let movies = await getMovies();

    if (movies?.length) {
      document.querySelector('table')?.remove();

      let table = document.createElement('table');
      table.className = 'movie-table';
      let headerRow = document.createElement('tr');
      document.body.appendChild(table);
      table.appendChild(headerRow);

      let keys = Object.keys(movies[0]);
      keys.forEach((key) => {
        let th = document.createElement('th');
        th.textContent = key;
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
    }
  } catch (error) {
    console.error('Error displaying the movies:', error);
  }
}

/* ---------------------------- REQUESTS ----------------------------  */

/* ---------------------------- END OF CODE ----------------------------  */
// function updateAMovie(){

// }

// function deleteAMovie(){

// }
