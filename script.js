// Replace 'YOUR_TMDB_API_KEY' with your actual TMDb API key
const TMDB_API_KEY = '950db6d1bb721107817f818673253589';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Elements
const genreSelect = document.getElementById('genre');
const recommendButton = document.getElementById('recommendButton');
const resultsDiv = document.getElementById('results');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle
themeToggle.addEventListener('change', () => {
  document.documentElement.setAttribute(
    'data-theme',
    themeToggle.checked ? 'dark' : 'light'
  );
});

// Fetch Genres from TMDb
async function fetchGenres() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    populateGenreSelect(data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
}

// Populate Genre Select Dropdown
function populateGenreSelect(genres) {
  genres.forEach((genre) => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Fetch Trending Movies from TMDb
async function fetchTrendingMovies(genreId = 'all') {
  try {
    let url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
    if (genreId !== 'all') {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
  }
}

// Display Movies in the Grid
function displayMovies(movies) {
  resultsDiv.innerHTML = '';
  movies.forEach((movie) => {
    const movieCard = `
      <div class="movie-card">
        <img src="${TMDB_IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Learn More</a>
      </div>
    `;
    resultsDiv.innerHTML += movieCard;
  });
}

// Event Listener for Button
recommendButton.addEventListener('click', () => {
  const selectedGenre = genreSelect.value;
  fetchTrendingMovies(selectedGenre);
});

// Initialize the Page
fetchGenres();
fetchTrendingMovies();
