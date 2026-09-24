// =========================================================
// EasyBook Travel — script.js

const flightForm = document.querySelector("#origin").closest("form");
const errorMessage = document.getElementById("flight-form-error");

flightForm.addEventListener("submit", function (event) {

  const origin = document.getElementById("origin").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const departDate = document.getElementById("depart-date").value;

  if (origin === "" || destination === "" || departDate === "") {

    event.preventDefault();

    errorMessage.textContent =
      "Please tell us where you're flying from, where you're going, and your departure date.";

  } else {

    errorMessage.textContent = "";
  }
});