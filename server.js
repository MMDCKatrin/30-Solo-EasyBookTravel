const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const BOOKINGS_FILE = path.join(__dirname, "data", "bookings.json");
const MESSAGES_FILE = path.join(__dirname, "data", "messages.json");

const TRAVELER_OPTIONS = ["1", "2", "3", "4", "5+"];
const BAG_OPTIONS = ["0", "1", "2", "3+"];

app.use(express.json());
app.use(express.static(__dirname));

function readData(file) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveData(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

function makeReference(bookings) {
  let ref;
  do {
    ref = "EB-" + Math.floor(10000 + Math.random() * 90000);
  } while (bookings.some((b) => b.reference === ref));
  return ref;
}

app.get("/api/bookings", (req, res) => {
  res.json(readData(BOOKINGS_FILE));
});

app.post("/api/bookings", (req, res) => {
  const origin = String(req.body.origin || "").trim();
  const destination = String(req.body.destination || "").trim();
  const departDate = String(req.body.departDate || "");
  const returnDate = String(req.body.returnDate || "");
  const travelers = String(req.body.travelers || "");
  const bags = String(req.body.bags || "");
  const errors = [];

  if (origin === "") errors.push("Please tell us where you're flying from.");
  if (destination === "") errors.push("Please tell us where you're going.");
  if (origin !== "" && origin.toLowerCase() === destination.toLowerCase()) {
    errors.push("Your starting place and destination are the same. Please choose a different destination.");
  }
  if (departDate === "") {
    errors.push("Please pick the date you're leaving.");
  } else if (departDate < todayString()) {
    errors.push("That date has already passed. Please pick today or a later date.");
  }
  if (returnDate !== "" && returnDate < departDate) {
    errors.push("Your return date is before your departure date. Please pick a later date.");
  }
  if (!TRAVELER_OPTIONS.includes(travelers)) errors.push("Please choose how many people are traveling.");
  if (!BAG_OPTIONS.includes(bags)) errors.push("Please choose how many bags you're bringing.");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const bookings = readData(BOOKINGS_FILE);
  const newBooking = {
    id: Date.now(),
    reference: makeReference(bookings),
    origin,
    destination,
    departDate,
    returnDate,
    travelers,
    bags,
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  saveData(BOOKINGS_FILE, bookings);

  res.status(201).json({ success: true, booking: newBooking });
});

app.delete("/api/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookings = readData(BOOKINGS_FILE);
  const remaining = bookings.filter((b) => b.id !== id);

  if (remaining.length === bookings.length) {
    return res.status(404).json({ success: false, errors: ["We couldn't find that trip. It may already be cancelled."] });
  }

  saveData(BOOKINGS_FILE, remaining);
  res.json({ success: true });
});

app.post("/api/messages", (req, res) => {
  const name = String(req.body.name || "").trim();
  const message = String(req.body.message || "").trim();
  const errors = [];

  if (name === "") errors.push("Please tell us your name.");
  if (message.length < 10) errors.push("Please write a little more so we know how to help (at least 10 characters).");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const messages = readData(MESSAGES_FILE);
  messages.push({
    id: Date.now(),
    name,
    message,
    receivedAt: new Date().toISOString()
  });
  saveData(MESSAGES_FILE, messages);

  res.status(201).json({ success: true, name });
});

app.listen(PORT, () => {
  console.log(`EasyBook Travel is running at http://localhost:${PORT}`);
});
