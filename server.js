const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "bookings.json");

app.use(express.json());
app.use(express.static(__dirname));

function readBookings() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveBookings(bookings) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

app.get("/api/bookings", (req, res) => {
  res.json(readBookings());
});

app.post("/api/bookings", (req, res) => {
  const { fullName, origin, destination, departDate, returnDate, travelers } = req.body;
  const errors = [];

  if (!fullName || fullName.trim() === "") errors.push("Please enter your full name.");
  if (!origin || origin.trim() === "") errors.push("Please enter where you are flying from.");
  if (!destination || destination.trim() === "") errors.push("Please enter where you are flying to.");
  if (origin && destination && origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
    errors.push("Your departure and destination cannot be the same place.");
  }
  if (!departDate) errors.push("Please choose a departure date.");

  const today = new Date().toISOString().split("T")[0];
  if (departDate && departDate < today) errors.push("Your departure date cannot be in the past.");
  if (returnDate && departDate && returnDate < departDate) {
    errors.push("Your return date must be after your departure date.");
  }

  const count = Number(travelers);
  if (!Number.isInteger(count) || count < 1 || count > 9) {
    errors.push("Number of travelers must be between 1 and 9.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const bookings = readBookings();
  const newBooking = {
    id: Date.now(),
    fullName: fullName.trim(),
    origin: origin.trim(),
    destination: destination.trim(),
    departDate,
    returnDate: returnDate || "",
    travelers: count,
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  saveBookings(bookings);

  res.status(201).json({ success: true, booking: newBooking });
});

app.delete("/api/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookings = readBookings();
  const remaining = bookings.filter((b) => b.id !== id);

  if (remaining.length === bookings.length) {
    return res.status(404).json({ success: false, errors: ["Booking not found."] });
  }

  saveBookings(remaining);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`EasyBook Travel is running at http://localhost:${PORT}`);
});
