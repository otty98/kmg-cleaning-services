// Scroll to booking section
function scrollToBooking() {
    document.getElementById("booking").scrollIntoView({
      behavior: "smooth"
    });
  }
  
  // Load bookingss when page opens
  displayBookings();
  
  // Form submission
  document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const service = document.getElementById("service").value;
  
    const booking = {
      name,
      date,
      time,
      service
    };
  
    // Get existing bookings
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  
    // Add new bookong
    bookings.push(booking);
  
    // Save back to localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings));
  
    // Refresh booking list
    displayBookings();
  
    // Clear form
    document.getElementById("bookingForm").reset();
  
    alert("Booking submitted successfully!");
  });
  
  // Display bookings
  function displayBookings() {
    const bookingsList = document.getElementById("bookingsList");
  
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  
    bookingsList.innerHTML = "";
  
    bookings.forEach((booking) => {
      const bookingCard = document.createElement("div");
  
      bookingCard.innerHTML = `
        <h3>${booking.name}</h3>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <hr>
      `;
  
      bookingsList.appendChild(bookingCard);
    });
  }