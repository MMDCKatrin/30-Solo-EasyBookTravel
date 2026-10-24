const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const bookingList = document.getElementById("bookingList");

function showMessage(text, isError) {
  bookingMessage.innerHTML = text;
  bookingMessage.className = isError ? "message error" : "message success";
}

function formatDate(dateString) {
  if (!dateString) return "One way";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

async function loadBookings() {
  try {
    const response = await fetch("/api/bookings");
    const bookings = await response.json();

    if (bookings.length === 0) {
      bookingList.innerHTML = "<p>You have no saved trips yet.</p>";
      return;
    }

    bookingList.innerHTML = "";
    bookings.forEach((booking) => {
      const item = document.createElement("article");
      item.className = "booking-card";
      item.innerHTML = `
        <h3>${booking.origin} to ${booking.destination}</h3>
        <p><strong>Name:</strong> ${booking.fullName}</p>
        <p><strong>Leaving:</strong> ${formatDate(booking.departDate)}</p>
        <p><strong>Returning:</strong> ${formatDate(booking.returnDate)}</p>
        <p><strong>Travelers:</strong> ${booking.travelers}</p>
        <button type="button" class="btn" data-id="${booking.id}">Cancel this trip</button>
      `;
      bookingList.appendChild(item);
    });
  } catch (err) {
    bookingList.innerHTML = "<p>We could not load your trips. Please make sure the server is running.</p>";
  }
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (!result.success) {
      showMessage(result.errors.join("<br>"), true);
      return;
    }

    showMessage(`Your trip to ${result.booking.destination} has been saved!`, false);
    bookingForm.reset();
    loadBookings();
  } catch (err) {
    showMessage("Something went wrong. Please try again later.", true);
  }
});

bookingList.addEventListener("click", async (event) => {
  if (!event.target.matches("button[data-id]")) return;

  const confirmed = confirm("Are you sure you want to cancel this trip?");
  if (!confirmed) return;

  const id = event.target.dataset.id;
  const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
  const result = await response.json();

  if (result.success) {
    showMessage("Your trip has been cancelled.", false);
  } else {
    showMessage(result.errors.join("<br>"), true);
  }
  loadBookings();
});

loadBookings();
