// Scroll to booking form (skips past the pricing cards)
function scrollToBooking() {
  document.getElementById("bookingForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Load bookings and time slots when page opens
displayBookings();
generateTimeSlots();

// Form submission
document.getElementById("bookingForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const date    = document.getElementById("date").value;
  const time    = document.getElementById("time").value;
  const service = document.getElementById("service").value;

  // Check all fields are filled
  if (!name || !date || !time || !service) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  // Check date is not in the past
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    showMessage("You cannot book a date in the past.", "error");
    return;
  }

  // If booking is today, check the time slot hasn't already passed
  if (date === today) {
    const currentHour = new Date().getHours();
    const slotStartHour = parseInt(time.split(":")[0]);
    if (slotStartHour <= currentHour) {
      showMessage("This time slot has already passed today. Please choose a later time.", "error");
      return;
    }
  }

  // Get existing bookings
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // Check if time slot is already taken on that date
  const bookingExists = bookings.some(b => b.date === date && b.time === time);
  if (bookingExists) {
    showMessage("This time slot is already booked. Please choose another time.", "error");
    return;
  }

  // Save new booking
  bookings.push({ name, date, time, service });
  localStorage.setItem("bookings", JSON.stringify(bookings));

  displayBookings();
  document.getElementById("bookingForm").reset();
  showMessage("Booking submitted successfully!", "success");
});


/**
 * Generates 2-hour booking slots (08:00–16:00).
 */
function generateTimeSlots() {
  const timeSelect = document.getElementById("time");
  timeSelect.innerHTML = "";

  const slots = [
    { start: 8,  end: 10 },
    { start: 10, end: 12 },
    { start: 12, end: 14 },
    { start: 14, end: 16 }
  ];

  slots.forEach(slot => {
    const option = document.createElement("option");
    const start = `${slot.start.toString().padStart(2, "0")}:00`;
    const end   = `${slot.end.toString().padStart(2, "0")}:00`;
    option.value       = `${start}-${end}`;
    option.textContent = `${start} - ${end}`;
    timeSelect.appendChild(option);
  });
}


/**
 * Renders all bookings from localStorage.
 */
function displayBookings() {
  const bookingsList = document.getElementById("bookingsList");
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  bookingsList.innerHTML = "";

  if (bookings.length === 0) {
    bookingsList.innerHTML = "<p>No bookings yet.</p>";
    return;
  }

  bookings.forEach((booking, index) => {
    const formattedDate = new Date(booking.date).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const bookingCard = document.createElement("div");
    bookingCard.classList.add("booking-card");
    bookingCard.innerHTML = `
      <h3>${booking.name}</h3>
      <p><strong>Service:</strong> ${booking.service}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
      <button onclick="deleteBooking(${index})">Delete Booking</button>
    `;

    bookingsList.appendChild(bookingCard);
  });
}


/**
 * Deletes a booking by index.
 */
function deleteBooking(index) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  displayBookings();
  showMessage("Booking deleted successfully!", "success");
}


/**
 * Shows a timed success or error message.
 */
function showMessage(message, type) {
  const messageBox = document.getElementById("message");
  messageBox.textContent = message;
  messageBox.className = type;
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}