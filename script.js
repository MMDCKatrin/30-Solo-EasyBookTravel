
function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");  // months start at 0, so +1
  const day = String(now.getDate()).padStart(2, "0");         // padStart: 5 becomes "05"
  return year + "-" + month + "-" + day;
}

function prettyDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function describeCount(value, singular, plural) {
  if (value.endsWith("+")) {
    return value.slice(0, -1) + " or more " + plural;  // slice removes the "+"
  }
  if (value === "0") {
    return "no " + plural;
  }
  if (value === "1") {
    return "1 " + singular;
  }
  return value + " " + plural;
}

function createMessageBox(form) {
  const box = document.createElement("p");
  box.setAttribute("aria-live", "polite");
  form.appendChild(box);
  return box;
}

function showMessage(box, text, type) {
  box.className = type === "success" ? "form-success" : "form-error";
  box.textContent = text;
}

function clearMessage(box) {
  box.textContent = "";
}

function showProblem(box, field, text) {
  showMessage(box, text, "error");
  field.focus();
}

function useTextAsPlaceholder(textarea) {
  textarea.placeholder = textarea.defaultValue;
  textarea.defaultValue = "";
}
 
const flightForm = document.querySelector("#origin").closest("form");
const errorMessage = document.getElementById("flight-form-error");
const destinationInput = document.getElementById("destination");
const departInput = document.getElementById("depart-date");
const returnInput = document.getElementById("return-date");
const travelersInput = document.getElementById("travelers");
const bagsInput = document.getElementById("bags");
const flightBox = document.getElementById("flight-form-error");

flightForm.noValidate = true;
flightBox.setAttribute("aria-live", "polite");

departInput.min = todayString();
returnInput.min = todayString();

departInput.addEventListener("change", function () {
  if (departInput.value === "") {
    returnInput.min = todayString();
    return;
  }

  returnInput.min = departInput.value;

    if (returnInput.value !== "" && returnInput.value < departInput.value) {
    returnInput.value = "";
  }
});

flightForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();
  const departDate = departInput.value;
  const returnDate = returnInput.value;

    if (origin === "") {
    showProblem(flightBox, originInput, "Please tell us where you're flying from.");
    return;
  }

  if (origin.toLowerCase() === destination.toLowerCase()) {
    showProblem(flightBox, destinationInput, "Your starting place and destination are the same. Please choose a different destination.");
    return;
  }

  if (departDate === "") {
    showProblem(flightBox, departInput, "Please pick the date you're leaving.");
    return;
  }
 
  if (departDate < todayString()) {
    showProblem(flightBox, departInput, "That date has already passed. Please pick today or a later date.");
    return;
  }
 
  if (returnDate !== "" && returnDate < departDate) {
    showProblem(flightBox, returnInput, "Your return date is before your departure date. Please pick a later date.");
    return;
  }

  const people = describeCount(travelersInput.value, "person", "people");
  const bags = describeCount(bagsInput.value, "bag", "bags");

  let summary = "Here's your trip: from " + origin + " to " + destination +
    ", leaving " + prettyDate(departDate);
 
  if (returnDate === "") {
    summary += " (one way)";
  } else {
    summary += ", coming back " + prettyDate(returnDate);
  }
 
  summary += ", for " + people + " with " + bags + ".";
  summary += " Next you'll choose your flight. (That page is still being built.)";
 
  showMessage(flightBox, summary, "success");
});
 
const destinations = [

   { name: "Boracay", place: "Aklan, Philippines", where: "domestic", style: "beach",
    budgets: ["mid-range", "luxury"], lengths: ["weekend", "week"],
    blurb: "A famous white-sand beach with plenty of hotels and restaurants." },
  { name: "Siargao", place: "Surigao del Norte, Philippines", where: "domestic", style: "beach",
    budgets: ["budget", "mid-range"], lengths: ["week", "two-weeks"],
    blurb: "A laid-back island known for surfing and quiet beaches." },
  { name: "Puerto Galera", place: "Oriental Mindoro, Philippines", where: "domestic", style: "beach",
    budgets: ["budget", "mid-range"], lengths: ["weekend"],
    blurb: "Beaches and snorkeling that are close to Manila." },
  { name: "Cebu City", place: "Cebu, Philippines", where: "domestic", style: "city",
    budgets: ["budget", "mid-range"], lengths: ["weekend", "week"],
    blurb: "A busy city with old churches, good food and easy day trips." },
  { name: "Makati", place: "Metro Manila, Philippines", where: "domestic", style: "city",
    budgets: ["mid-range", "luxury"], lengths: ["weekend", "week"],
    blurb: "Shopping, restaurants and comfortable hotels in the middle of the city." },
  { name: "Baguio", place: "Benguet, Philippines", where: "domestic", style: "nature",
    budgets: ["budget", "mid-range"], lengths: ["weekend"],
    blurb: "Cool mountain air, pine trees and lively markets." },
  { name: "Banaue", place: "Ifugao, Philippines", where: "domestic", style: "nature",
    budgets: ["budget", "mid-range"], lengths: ["week", "two-weeks"],
    blurb: "Famous rice terraces carved into the mountains." },
  { name: "Vigan", place: "Ilocos Sur, Philippines", where: "domestic", style: "culture",
    budgets: ["budget", "mid-range"], lengths: ["weekend", "week"],
    blurb: "A preserved Spanish-era town with cobblestone streets." },
  { name: "Intramuros", place: "Manila, Philippines", where: "domestic", style: "culture",
    budgets: ["budget", "mid-range"], lengths: ["weekend"],
    blurb: "Walk through Manila's old walled city and its historic churches." },
  { name: "Iloilo City", place: "Iloilo, Philippines", where: "domestic", style: "culture",
    budgets: ["budget", "mid-range"], lengths: ["weekend", "week"],
    blurb: "Heritage churches and old mansions at a relaxed pace." },
 
  // ----- Outside the Philippines -----
  { name: "Bali", place: "Indonesia", where: "international", style: "beach",
    budgets: ["budget", "mid-range"], lengths: ["week", "two-weeks"],
    blurb: "Beaches, rice fields and temples in one trip." },
  { name: "Phuket", place: "Thailand", where: "international", style: "beach",
    budgets: ["budget", "mid-range"], lengths: ["weekend", "week"],
    blurb: "A popular beach island with many hotels and tours." },
  { name: "Maldives", place: "Indian Ocean", where: "international", style: "beach",
    budgets: ["luxury"], lengths: ["week", "two-weeks"],
    blurb: "Overwater villas and calm, clear water made for resting." },
  { name: "Tokyo", place: "Japan", where: "international", style: "city",
    budgets: ["mid-range", "luxury"], lengths: ["week", "two-weeks"],
    blurb: "A huge, clean city that is easy to get around, with great food." },
  { name: "Singapore", place: "Singapore", where: "international", style: "city",
    budgets: ["mid-range", "luxury"], lengths: ["weekend", "week"],
    blurb: "Safe, tidy and easy to travel around, with a lot to see in a short time." },
  { name: "Hong Kong", place: "China", where: "international", style: "city",
    budgets: ["budget", "mid-range"], lengths: ["weekend", "week"],
    blurb: "Skyscrapers, markets and great food, not far from the Philippines." },
  { name: "Chiang Mai", place: "Thailand", where: "international", style: "nature",
    budgets: ["budget", "mid-range"], lengths: ["week"],
    blurb: "Cool hills, temples and gentle outings in nature." },
  { name: "New Zealand", place: "Oceania", where: "international", style: "nature",
    budgets: ["mid-range", "luxury"], lengths: ["two-weeks"],
    blurb: "Mountains, lakes and wide open scenery. It's a long trip, so give it time." },
  { name: "Kyoto", place: "Japan", where: "international", style: "culture",
    budgets: ["mid-range", "luxury"], lengths: ["week", "two-weeks"],
    blurb: "Old temples, quiet gardens and traditional streets." },
  { name: "Siem Reap", place: "Cambodia", where: "international", style: "culture",
    budgets: ["budget", "mid-range"], lengths: ["weekend", "week"],
    blurb: "Home of the Angkor Wat temples." }
];
 
const tripForm = document.getElementById("trip-type").closest("form");
tripForm.noValidate = true;

tripResults.className = "results";
tripResults.setAttribute("aria-live", "polite");
tripForm.after(tripResults);

function describeFit(matchesBudget, matchesLength) {
  if (matchesBudget && matchesLength) {
    return "Fits your budget and your trip length.";
  }
  if (matchesBudget) {
    return "Fits your budget. It may suit a shorter or longer trip.";
  }
  if (matchesLength) {
    return "Fits your trip length. It may cost more or less than you planned.";
  }
  return "Matches the kind of trip you want, though the budget and length may differ.";
}

function makeCard(place, matchesBudget, matchesLength) {
  const card = document.createElement("article");
  card.className = "result-card";
 
  const title = document.createElement("h3");
  title.textContent = place.name;
 
  const where = document.createElement("p");
  where.className = "result-place";
  where.textContent = place.place;
 
  const blurb = document.createElement("p");
  blurb.textContent = place.blurb;
 
  const fit = document.createElement("p");
  fit.className = "result-fit";
  fit.textContent = describeFit(matchesBudget, matchesLength);
 
  const button = document.createElement("button");
  button.type = "button";   // "button" means: don't submit a form, just click
  button.textContent = "Book a flight to " + place.name;
  button.addEventListener("click", function () {
    chooseDestination(place.name);
  });
 
  card.append(title, where, blurb, fit, button);
  return card;
}
 
function makeCard(place, matchesBudget, matchesLength) {
  const card = document.createElement("article");
  card.className = "result-card";
 
  const title = document.createElement("h3");
  title.textContent = place.name;
 
  const where = document.createElement("p");
  where.className = "result-place";
  where.textContent = place.place;
 
  const blurb = document.createElement("p");
  blurb.textContent = place.blurb;
 
  const fit = document.createElement("p");
  fit.className = "result-fit";
  fit.textContent = describeFit(matchesBudget, matchesLength);
 
  const button = document.createElement("button");
  button.type = "button";   // "button" means: don't submit a form, just click
  button.textContent = "Book a flight to " + place.name;
  button.addEventListener("click", function () {
    chooseDestination(place.name);
  });
 
  card.append(title, where, blurb, fit, button);
  return card;
}
 function chooseDestination(name) {
  destinationInput.value = name;
  clearMessage(flightBox);

  flightForm.closest("section").scrollIntoView({ behavior: "smooth" });
  const next = originInput.value.trim() === "" ? originInput : departInput;
  next.focus({ preventScroll: true });
}
 tripForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const where = document.getElementById("trip-type").value;
  const style = document.getElementById("trip-style").value;
  const budget = document.getElementById("trip-budget").value;
  const length = document.getElementById("trip-length").value;

const matches = [];
  for (const place of destinations) {
    if (place.where === where && place.style === style) {
      const matchesBudget = place.budgets.includes(budget);
      const matchesLength = place.lengths.includes(length);
 
      let score = 0;
      if (matchesBudget) { score++; }
      if (matchesLength) { score++; }
 
      matches.push({
        place: place,
        matchesBudget: matchesBudget,
        matchesLength: matchesLength,
        score: score
      });
    }

  }matches.sort(function (a, b) {
    return b.score - a.score;
  });

  const topThree = matches.slice(0, 3);
  tripResults.replaceChildren();
  const intro = document.createElement("p");
  intro.className = "result-intro";

  if (topThree.length === 0) {
    intro.textContent = "Sorry, we couldn't find a match. Please try different answers.";
    tripResults.appendChild(intro);
    return;
  }

  intro.textContent = topThree.length === 1
    ? "Here's an idea for you:"
    : "Here are " + topThree.length + " ideas for you:";
  tripResults.appendChild(intro);
 
  for (const match of topThree) {
    tripResults.appendChild(makeCard(match.place, match.matchesBudget, match.matchesLength));
  }

   intro.scrollIntoView({ behavior: "smooth", block: "start" });
});

const accountForm = document.getElementById("full-name").closest("form");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const aboutInput = document.getElementById("about");
const accountBox = createMessageBox(accountForm);
 
accountForm.noValidate = true;
useTextAsPlaceholder(aboutInput);

const passwordHint = document.createElement("p");
passwordHint.className = "hint";
passwordInput.after(passwordHint); 

passwordInput.addEventListener("input", function () {
  const length = passwordInput.value.length;
 
  if (length === 0) {
    passwordHint.textContent = "";
    passwordHint.className = "hint";
  } else if (length < 8) {
    const missing = 8 - length;
    passwordHint.textContent = "Keep going: " + missing + " more character" +
      (missing === 1 ? "" : "s") + " needed.";
    passwordHint.className = "hint";
  } else {
    passwordHint.textContent = "Good, that's long enough.";
    passwordHint.className = "hint hint-ok";
  }
});

const showRow = document.createElement("div");
showRow.className = "checkbox-row";
 
const showBox = document.createElement("input");
showBox.type = "checkbox";
showBox.id = "show-password";

const showLabel = document.createElement("label");
showLabel.htmlFor = "show-password";
showLabel.textContent = "Show my password";

showBox.addEventListener("change", function () {
  passwordInput.type = showBox.checked ? "text" : "password";
});

showRow.append(showBox, showLabel);
passwordHint.after(showRow);

accountForm.addEventListener("submit", function (event) {
  event.preventDefault();
 
  const name = fullNameInput.value.trim();
  const email = emailInput.value.trim();
 
  if (name === "") {
    showProblem(accountBox, fullNameInput, "Please enter your full name.");
    return;
  }
 
  if (email === "") {
    showProblem(accountBox, emailInput, "Please enter your email address.");
    return;
  }

   if (!emailInput.validity.valid) {
    showProblem(accountBox, emailInput, "That email address doesn't look right. It should look like name@example.com.");
    return;
  }
 
  if (passwordInput.value.length < 8) {
    showProblem(accountBox, passwordInput, "Your password needs at least 8 characters.");
    return;
  }
  const firstName = name.split(" ")[0];
  showMessage(accountBox, "Welcome, " + firstName + "! Your account is ready. (This is a practice version, so nothing has been saved.)", "success");
   accountForm.reset();
  passwordInput.type = "password";
  passwordHint.textContent = "";
  passwordHint.className = "hint";
});

const contactForm = document.getElementById("contact-name").closest("form");
const contactNameInput = document.getElementById("contact-name");
const contactMessageInput = document.getElementById("contact-message");
const contactBox = createMessageBox(contactForm);
 
contactForm.noValidate = true;
useTextAsPlaceholder(contactMessageInput);
 
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
 
  const name = contactNameInput.value.trim();
  const message = contactMessageInput.value.trim();
 
  if (name === "") {
    showProblem(contactBox, contactNameInput, "Please tell us your name.");
    return;
  }
 
  if (message === "") {
    showProblem(contactBox, contactMessageInput, "Please write a short message so we know how to help.");
    return;
  }
 
  showMessage(contactBox, "Thank you, " + name.split(" ")[0] + ". We got your message. (This is a practice version, so it hasn't been sent anywhere.)", "success");
  contactForm.reset();
});