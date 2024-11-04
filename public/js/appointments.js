// public/js/appointments.js
document.addEventListener('DOMContentLoaded', () => {
    // Fetch appointments data from the server
    fetch('/appointments')
        .then(response => response.json())
        .then(data => displayAppointments(data))
        .catch(error => console.error('Error fetching appointments:', error));

    function displayAppointments(appointments) {
        const appointmentsList = document.getElementById('appointments-list');

        // Clear any existing content
        appointmentsList.innerHTML = '';

        // Loop through appointments and create cards
        appointments.forEach(appointment => {
            const card = document.createElement('div');
            card.classList.add('appointment-card');

            // Add appointment details to the card
            const header = document.createElement('h3');
            header.textContent = appointment.fullName;
            card.appendChild(header);

            const email = document.createElement('p');
            email.textContent = `Email: ${appointment.email}`;
            card.appendChild(email);

            const phoneNumber = document.createElement('p');
            phoneNumber.textContent = `Phone Number: ${appointment.phoneNumber}`;
            card.appendChild(phoneNumber);

            const date = document.createElement('p');
            date.textContent = `Date: ${appointment.date}`;
            card.appendChild(date);

            const time = document.createElement('p');
            time.textContent = `Time: ${appointment.time}`;
            card.appendChild(time);

            const message = document.createElement('p');
            message.textContent = `Message: ${appointment.message}`;
            card.appendChild(message);

            // Append the card to the list
            appointmentsList.appendChild(card);
        });
    }
});
