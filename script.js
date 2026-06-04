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

    // We check if the date is in the past
    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
        showMessage(
            "You cannot book a date in the past.",
            "error"
        );
        return;
    }
    
    console.log("Current booking:", { date, time });
    console.log("Existing bookings:", bookings);
    // We check if the time slot is already booked by another customer
    const bookingExists = bookings.some(existingBooking => {
        console.log("Comparing:");
        console.log("Existing Date:", existingBooking.date);
        console.log("Current Date:", date);
        console.log("Existing Time:", existingBooking.time);
        console.log("Current Time:", time);
    
        return (
            existingBooking.date === date &&
            existingBooking.time === time
        );
    });
    
    if (bookingExists) {
        showMessage(
            "This time slot is already booked. Please choose another time.",
            "error"
        );
        return;
    }
    console.log("Booking exists:", bookingExists);


    bookings.push(booking);
  
    // Save back to localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings));
  
    // Refresh booking list
    displayBookings();
  
    // Clear form
    document.getElementById("bookingForm").reset();
  
    showMessage("Booking submitted successfully!", "success");
  });


  
  // Display bookings
  function displayBookings() {
      // We get the bookings list element
      const bookingsList = document.getElementById("bookingsList");

      // We get the bookings from localStorage
      let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

      // Clear bookings list
      bookingsList.innerHTML = "";

      // Handle empty bookings
      if (bookings.length === 0) {
          bookingsList.innerHTML = "<p>No bookings yet.</p>";
          return;
      }

      // Loop through bookings
      bookings.forEach((booking, index) => {

          // Format date for display only
          const formattedDate = new Date(booking.date)
              .toLocaleDateString("en-ZA", {
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

              <button onclick="deleteBooking(${index})">
                  Delete Booking
              </button>
          `;

          bookingsList.appendChild(bookingCard);
      });
  }



  // Delete booking
  function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // We remove the booking from the array
    bookings.splice(index, 1);

    // We save the updated array back to localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Refresh booking list
    displayBookings();

    showMessage("Booking deleted successfully!", "success");
}



  // Show message
  function showMessage(message, type) {
    const messageBox = document.getElementById("message");

    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}