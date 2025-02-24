// services.js
export async function postMovie(movie) {
  try {
    let response = await fetch('http://localhost:3000/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
}

export async function getMovie(criteria) {
  try {
    const response = await fetch('http://localhost:3000/movies');
    const movies = await response.json();
    return movies.filter((movie) => {
      return Object.entries(criteria).every(([key, value]) => {
        return String(movie[key])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
  } catch {
    console.error('Error getting the movie:', error);
    throw error;
  }
}

export async function getMovies() {
  try {
    let response = await fetch(`http://localhost:3000/movies/`);
    let movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Error fetching the movies:', error);
    throw error;
  }
}

export async function putMovie(movie) {
  try {
    let response = await fetch(`http://localhost:3000/movies/${movie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
}

export async function deleteMovieById(movieId) {
  try {
    let response = await fetch(`http://localhost:3000/movies/${movieId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
}
