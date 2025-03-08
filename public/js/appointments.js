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

// Fetch appointments from the server and render them in the table
async function fetchAppointments() {
    try {
        const response = await fetch('/appointments'); // Fetch data from the server
        const appointments = await response.json(); // Parse JSON response

        // Get the table body element
        const tableBody = document.getElementById('appointments-table-body');

        // Clear the table before adding rows
        tableBody.innerHTML = '';

        // Populate the table with appointments
        appointments.forEach(appointment => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${appointment.fullName}</td>
                <td>${appointment.email}</td>
                <td>${appointment.phoneNumber}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.message}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

// Call the function to fetch and display appointments when the page loads
fetchAppointments();