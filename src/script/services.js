// services.js
export async function postMovie(movie) {
  try {
    let response = await fetch('http://localhost:3000/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    let data = await response.json();
    console.log('Movie Created:', data);
    return data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
}

export async function getMovie(movieId) {
  try {
    let response = await fetch(`http://localhost:3000/movies/${movieId}`);
    if (!response.ok) {
      throw new Error(`Movie with ID ${movieId} not found`);
    }
    let movie = await response.json();
    console.log('Movie Requested: ', movie);
    return movie;
  } catch (error) {
    console.error('Error fetching the movie:', error);
    throw error;
  }
}

export async function getMovies() {
  try {
    let response = await fetch(`http://localhost:3000/movies/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies. Server returned ${response.status}`);
    }
    let movies = await response.json();
    console.log('Here are the Movies: ', movies);
    return movies;
  } catch (error) {
    console.error('Error fetching the movies:', error);
    throw error;
  }
}

export async function updateMovie(movie) {
  try {
    let response = await fetch(`http://localhost:3000/movies/${movie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update movie. Server returned ${response.status}`);
    }
    
    let data = await response.json();
    console.log('Movie Updated:', data);
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
    
    if (!response.ok) {
      throw new Error(`Failed to delete movie. Server returned ${response.status}`);
    }
    
    console.log(`Movie with ID ${movieId} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
}