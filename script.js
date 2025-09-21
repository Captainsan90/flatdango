const filmsList = document.getElementById("films");
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const runtime = document.getElementById("runtime");
const showtime = document.getElementById("showtime");
const filmInfo = document.getElementById("film-info");
const ticketNum = document.getElementById("ticket-num");
const buyBtn = document.getElementById("buy-ticket");

let currentFilm = null;


fetch("http://localhost:3000/films")
  .then((res) => res.json())
  .then((films) => {
    films.forEach(renderFilm);
    if (films.length > 0) {
      displayFilm(films[0]); // 
    }
  });

// Render film inn sidebar
function renderFilm(film) {
  const li = document.createElement("li");
  li.textContent = film.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteFilm(film.id, li);
  });

  li.addEventListener("click", () => displayFilm(film));

  li.appendChild(deleteBtn);
  filmsList.appendChild(li);

  if (film.capacity - film.tickets_sold <= 0) {
    li.classList.add("sold-out");
  }
}

// 4 Displaying selected film
function displayFilm(film) {
  currentFilm = film;
  poster.src = film.poster;
  title.textContent = film.title;
  runtime.textContent = film.runtime;
  showtime.textContent = film.showtime;
  filmInfo.textContent = film.description;
  ticketNum.textContent = film.capacity - film.tickets_sold;

  if (film.capacity - film.tickets_sold <= 0) {
    buyBtn.textContent = "Sold Out";
    buyBtn.disabled = true;
  } else {
    buyBtn.textContent = "Buy Ticket";
    buyBtn.disabled = false;
  }
}

// 4 Handle ticket buying
buyBtn.addEventListener("click", () => {
  if (!currentFilm) return;

  if (currentFilm.tickets_sold < currentFilm.capacity) {
    currentFilm.tickets_sold += 1;
    ticketNum.textContent = currentFilm.capacity - currentFilm.tickets_sold;

    fetch(`http://localhost:3000/films/${currentFilm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold }),
    });

    if (currentFilm.tickets_sold >= currentFilm.capacity) {
      buyBtn.textContent = "Sold Out";
      buyBtn.disabled = true;
      markSoldOut(currentFilm.id);
    }
  }
});

// Mark sidebar item as sold out
function markSoldOut(id) {
  const items = filmsList.querySelectorAll("li");
  items.forEach((li) => {
    if (li.textContent.includes(currentFilm.title)) {
      li.classList.add("sold-out");
    }
  });
}

// Delete film
function deleteFilm(id, liElement) {
  fetch(`http://localhost:3000/films/${id}`, {
    method: "DELETE",
  }).then(() => {
    liElement.remove();
    if (currentFilm && currentFilm.id === id) {
      poster.src = "https://via.placeholder.com/300x400?text=Replace+Me";
      title.textContent = "[MOVIE TITLE]";
      runtime.textContent = "[RUNTIME]";
      showtime.textContent = "[SHOWTIME]";
      filmInfo.textContent = "[INSERT MOVIE DESCRIPTION HERE]";
      ticketNum.textContent = "[X]";
      buyBtn.textContent = "Buy Ticket";
      buyBtn.disabled = false;
    }
  });
}
