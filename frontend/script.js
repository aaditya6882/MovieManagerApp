let movies = [];
let currentEditingId = null;

document.getElementById("movieForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("movieName").value;
  const genre = document.getElementById("genre").value;
  const releaseDate = document.getElementById("releaseDate").value;
  const description = document.getElementById("movieDesc").value;
  const fileInput = document.getElementById("imageUpload");
  const file = fileInput.files[0];

  let imageUrl = "";

  if (file) {
    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = async function () {
      imageUrl = reader.result;
      await saveMovie({
        title,
        genre,
        releaseDate,
        description,
        imageUrl,
      });
    };
    reader.readAsDataURL(file);
  } else {
    // If editing, keep existing image
    if (currentEditingId) {
      const movie = movies.find((m) => m._id === currentEditingId);
      imageUrl = movie ? movie.imageUrl : "";
    }
    await saveMovie({
      title,
      genre,
      releaseDate,
      description,
      imageUrl,
    });
  }
});

async function saveMovie(movie) {
  try {
    if (currentEditingId) {
      await fetch(`/api/movies/${currentEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
      currentEditingId = null;
    } else {
      await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
    }

    document.getElementById("movieForm").reset();
    document.getElementById("imagePreview").innerHTML = "";
    document.querySelector('#movieForm button[type="submit"]').textContent =
      "Add Movie";

    await loadMovies();
  } catch (error) {
    console.error("Error saving movie:", error);
  }
}

async function loadMovies() {
  try {
    const res = await fetch("/api/movies");
    movies = await res.json();
    renderMovies();
  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

function renderMovies() {
  const tbody = document.getElementById("movies-table-body");
  tbody.innerHTML = "";

  movies.forEach((movie) => {
    const row = document.createElement("tr");
    row.innerHTML = ` 
  	<td>${movie.title}</td> 
  	<td>${movie.genre}</td> 
  	<td>${movie.releaseDate}</td> 
  	<td>${movie.description}</td> 
  	<td>${
      movie.imageUrl
        ? `<img src="${movie.imageUrl}" style="max-width: 60px;" />`
        : ""
    }</td> 
  	<td> 
    	<div class="menu-wrapper"> 
      	<button class="kebab-btn">⋮</button> 
      	<div class="dropdown-menu"> 
        	<button onclick="viewMovie('${movie._id}')">View</button> 
        	<button onclick="editMovie('${movie._id}')">Edit</button> 
        	<button onclick="deleteMovie('${movie._id}')">Delete</button> 
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
  const movie = movies.find((m) => m._id === id);
  if (!movie) return;

  document.getElementById("movieName").value = movie.title;
  document.getElementById("genre").value = movie.genre;

  // Format date for input[type="date"]
  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toISOString().split("T")[0]
    : "";
  document.getElementById("releaseDate").value = formattedDate;

  document.getElementById("movieDesc").value = movie.description;

  // Show current image preview
  const preview = document.getElementById("imagePreview");
  if (movie.imageUrl) {
    preview.innerHTML = ` 
  	<p>Current image:</p> 
  	<img src="${
      movie.imageUrl
    }" style="max-width: 120px; display: block; margin-bottom: 5px;" /> 
  	<small>${extractFileName(movie.imageUrl)}</small> 
	`;
  } else {
    preview.innerHTML = `<small>No image uploaded</small>`;
  }

  // Change button text
  document.querySelector('#movieForm button[type="submit"]').textContent =
    "Edit Movie";
  document.querySelector("main h1").textContent = "Edit Movie";

  currentEditingId = id;
  window.scrollTo(0, 0);
}

// Helper to extract image file name from URL/Base64
function extractFileName(url) {
  if (url.startsWith("data:")) return "Uploaded Image";
  try {
    return url.split("/").pop().split("?")[0];
  } catch {
    return "";
  }
}

async function deleteMovie(id) {
  try {
    await fetch(`/api/movies/${id}`, { method: "DELETE" });
    await loadMovies();
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
}

async function viewMovie(id) {
  try {
    const res = await fetch(`/api/movies/${id}`);
    if (!res.ok) throw new Error("Movie not found");

    const movie = await res.json();

    // Create modal container
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0, 0, 0, 0.75)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";
    modal.style.overflowY = "auto";
    modal.style.padding = "20px";
    modal.style.transition = "opacity 0.3s ease-in-out";
    modal.style.opacity = "0";

    // Create modal content
    modal.innerHTML = ` 
  	<div style=" 
    	background: #ffffff; 
    	border-radius: 16px; 
    	max-width: 600px; 
    	width: 90%; 
    	margin: 20px; 
    	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); 
    	overflow: hidden; 
    	transform: scale(0.95); 
    	transition: transform 0.3s ease-in-out; 
  	"> 
    	<div style=" 
      	position: relative; 
      	padding: 24px; 
      	border-bottom: 1px solid #e5e7eb; 
    	"> 
      	<button style=" 
        	position: absolute; 
        	top: 16px; 
        	right: 16px; 
        	background: none;  
border: none; 
        	font-size: 24px; 
        	cursor: pointer; 
        	color: #6b7280; 
        	transition: color 0.2s; 
      	" onmouseover="this.style.color='#000'" onmouseout="this.style.color='#6b7280'">✖</button> 
      	<h2 style=" 
        	margin: 0; 
        	font-size: 28px; 
        	font-weight: 700; 
        	color: #1f2937; 
        	line-height: 1.2; 
      	">${movie.title}</h2> 
    	</div> 
    	<div style="padding: 24px;"> 
      	${
          movie.imageUrl
            ? `<img src="${movie.imageUrl}" style=" 
              	width: 100%; 
              	max-height: 300px; 
              	object-fit: cover; 
              	border-radius: 8px; 
              	margin-bottom: 20px; 
            	">`
            : '<div style="text-align: center; color: #6b7280; margin-bottom: 20px;">No image available</div>'
        } 
      	<div style=" 
        	display: grid; 
        	gap: 16px; 
        	font-size: 16px; 
        	color: #374151; 
      	"> 
        	<p style="margin: 0;"> 
          	<strong style="color: #1f2937;">Genre:</strong> ${movie.genre} 
        	</p> 
        	<p style="margin: 0;"> 
          	<strong style="color: #1f2937;">Release Date:</strong> ${
              movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"
            } 
        	</p> 
        	<p style="margin: 0;"> 
          	<strong style="color: #1f2937;">Description:</strong> ${
              movie.description || "No description available"
            } 
        	</p> 
      	</div> 
    	</div> 
    	<div style=" 
      	padding: 16px 24px; 
      	background: #f9fafb; 
      	text-align: right; 
    	"> 
      	<button style=" 
        	padding: 10px 20px; 
        	background: #2e696a; 
        	color: white; 
        	border: none; 
        	border-radius: 8px; 
        	font-size: 16px; 
        	cursor: pointer; 
        	transition: background 0.2s; 
      	" onmouseover="this.style.background='#3b8283'" onmouseout="this.style.background='#2e696a'"> 
        	Close 
      	</button> 
    	</div> 
  	</div> 
	`;

    // Append modal to body
    document.body.appendChild(modal);

    // Trigger fade-in and scale animation
    setTimeout(() => {
      modal.style.opacity = "1";
      modal.querySelector("div").style.transform = "scale(1)";
    }, 10);

    // Close modal on click of background or buttons
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.tagName === "BUTTON") {
        // Fade out animation
        modal.style.opacity = "0";
        modal.querySelector("div").style.transform = "scale(0.95)";
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      }
    });
  } catch (error) {
    console.error("Error viewing movie:", error);
    alert("Failed to load movie details.");
  }
}

// Load movies on page load
loadMovies();
