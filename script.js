// Data for Netflix Recommendations
const recommendations = [
  {
    title: "The Matrix",
    genre: "Sci-Fi",
    platform: "Netflix",
    description: "A hacker discovers the shocking truth about his reality.",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    link: "https://www.netflix.com",
  },
  {
    title: "Inception",
    genre: "Sci-Fi",
    platform: "Netflix",
    description: "A thief who enters dreams to steal secrets gets a chance to erase his criminal record.",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    link: "https://www.netflix.com",
  },
  {
    title: "Stranger Things",
    genre: "Drama",
    platform: "Netflix",
    description: "A group of kids uncover a dark secret when their friend disappears.",
    poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    link: "https://www.netflix.com",
  },
];

// Elements
const genreSelect = document.getElementById("genre");
const recommendButton = document.getElementById("recommendButton");
const resultsDiv = document.getElementById("results");

// Generate Recommendations
recommendButton.addEventListener("click", () => {
  const selectedGenre = genreSelect.value;

  // Filter recommendations
  const filtered = recommendations.filter((item) => {
    return selectedGenre === "all" || item.genre === selectedGenre;
  });

  // Display results
  resultsDiv.innerHTML = "";
  filtered.forEach((movie) => {
    const movieCard = `
      <div class="movie-card">
        <img src="${movie.poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
        <a href="${movie.link}" target="_blank">Watch Now</a>
      </div>
    `;
    resultsDiv.innerHTML += movieCard;
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = `<p>No recommendations found for the selected genre.</p>`;
  }
});
