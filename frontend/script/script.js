let movies = [];
let currentEditingId = null;

document.getElementById("movieForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("movieName").value;
  const genre = document.getElementById("genre").value;
  const releaseDate = document.getElementById("releaseDate").value;
  const description = document.getElementById("movieDesc").value;
  const fileInput = document.getElementById("imageUpload");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const movie = {
        id: currentEditingId || Date.now().toString(),
        name,
        genre,
        releaseDate,
        description,
        imageURL: reader.result, // base64
      };
      saveMovie(movie);
    };
    reader.readAsDataURL(file);
  } else {
    const existingImage = currentEditingId
      ? movies.find((m) => m.id === currentEditingId)?.imageURL
      : "";

    const movie = {
      id: currentEditingId || Date.now().toString(),
      name,
      genre,
      releaseDate,
      description,
      imageURL: existingImage,
    };
    saveMovie(movie);
  }
});

function saveMovie(movie) {
  if (currentEditingId) {
    const index = movies.findIndex((m) => m.id === currentEditingId);
    if (index !== -1) {
      movies[index] = movie;
    }
    currentEditingId = null;
  } else {
    movies.push(movie);
  }

  document.getElementById("movieForm").reset();
  renderMovies();
}

function renderMovies() {
  const tbody = document.getElementById("movies-table-body");
  tbody.innerHTML = "";

  movies.forEach((movie) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${movie.name}</td>
      <td>${movie.genre}</td>
      <td>${movie.releaseDate}</td>
      <td>${movie.description}</td>
      <td>${
        movie.imageURL
          ? `<img src="${movie.imageURL}" style="max-width: 60px;" />`
          : ""
      }</td>
      <td>
        <div class="menu-wrapper">
          <button class="kebab-btn">⋮</button>
          <div class="dropdown-menu">
            <button onclick="editMovie('${movie.id}')">Edit</button>
            <button onclick="deleteMovie('${movie.id}')">Delete</button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener("click", (e) => {
  // Close all menus
  document
    .querySelectorAll(".menu-wrapper")
    .forEach((wrapper) => wrapper.classList.remove("show"));

  if (e.target.classList.contains("kebab-btn")) {
    e.stopPropagation(); // Prevent auto-closing
    const wrapper = e.target.closest(".menu-wrapper");
    wrapper.classList.toggle("show");
  }
});

function editMovie(id) {
  const movie = movies.find((m) => m.id === id);
  if (!movie) return;

  document.getElementById("movieName").value = movie.name;
  document.getElementById("genre").value = movie.genre;
  document.getElementById("releaseDate").value = movie.releaseDate;
  document.getElementById("movieDesc").value = movie.description;

  currentEditingId = id;
  window.scrollTo(0, 0);
}

function deleteMovie(id) {
  movies = movies.filter((m) => m.id !== id);
  renderMovies();
}
