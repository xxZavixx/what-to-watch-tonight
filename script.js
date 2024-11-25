// TMDb API Key
const TMDB_API_KEY = '950db6d1bb721107817f818673253589'; // Replace with your actual API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Elements
const genreSelect = document.getElementById('genre');
const recommendButton = document.getElementById('recommendButton');
const resultsDiv = document.getElementById('results');
const themeToggle = document.getElementById('themeToggle');
const searchBar = document.getElementById('searchBar');
const watchlistDiv = document.getElementById('watchlist'); // Watchlist container for display (only if on watchlist.html)

// Watchlist
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Theme Toggle
themeToggle?.addEventListener('change', () => {
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

// Fetch Movies by Search Query
async function searchMovies() {
  const query = searchBar.value.trim();
  if (!query) {
    alert('Please enter a search term.');
    return;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error searching for movies:', error);
  }
}

// Display Movies in the Grid
function displayMovies(movies) {
  resultsDiv.innerHTML = '';
  if (!movies.length) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
    return;
  }

  movies.forEach((movie) => {
    const movieCard = `
      <div class="movie-card">
        <img src="${movie.poster_path ? TMDB_IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/300x400'}" alt="${movie.title}">
        <div class="overlay">
          <p>${movie.title}</p>
          <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Learn More</a>
        </div>
      </div>
    `;
    resultsDiv.innerHTML += movieCard;
  });
}

// Add Movie to Watchlist
function addToWatchlist(id, title, poster_path) {
  const movie = { id, title, poster_path }; // Create a movie object with id, title, and poster_path
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  if (!watchlist.some((item) => item.id === id)) {
    watchlist.push(movie); // Add movie to the watchlist
    localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save updated watchlist to localStorage
    alert(`${title} added to your watchlist!`);
  } else {
    alert(`${title} is already in your watchlist.`);
  }
}

// Remove Movie from Watchlist
function removeFromWatchlist(id) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist = watchlist.filter((movie) => movie.id !== id); // Remove movie with the given id
  localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save updated watchlist
  displayWatchlist(); // Refresh the displayed watchlist
}

// Display Watchlist on the Watchlist Page
function displayWatchlist() {
  if (!watchlistDiv) return; // Ensure this runs only on the Watchlist page

  watchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Re-fetch the watchlist to stay updated
  watchlistDiv.innerHTML = ''; // Clear existing content

  if (watchlist.length === 0) {
    watchlistDiv.innerHTML = '<p>Your watchlist is empty. Add movies to see them here.</p>';
    return;
  }

  watchlist.forEach((movie) => {
    const movieCard = `
      <div class="movie-card">
        <img src="${movie.poster_path ? TMDB_IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/300x400'}" alt="${movie.title}">
        <div class="overlay">
          <p>${movie.title}</p>
          <button onclick="removeFromWatchlist(${movie.id})">Remove from Watchlist</button>
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Learn More</a>
        </div>
      </div>
    `;
    watchlistDiv.innerHTML += movieCard; // Append movie card to the watchlist container
  });
}

// Scroll to Filters Section
function scrollToFilters() {
  document.getElementById('filters').scrollIntoView({ behavior: 'smooth' });
}

// Event Listeners
recommendButton?.addEventListener('click', () => {
  const selectedGenre = genreSelect.value;
  fetchTrendingMovies(selectedGenre);
});

// Initialize the Page
fetchGenres();
fetchTrendingMovies();
displayWatchlist(); // Initialize watchlist if on watchlist.html
