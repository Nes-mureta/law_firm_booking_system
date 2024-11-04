// src/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointments');

router.post('/book-appointment', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, date, time, message } = req.body;

        // Create appointment in the database
        const newAppointment = await Appointment.create({
            //userId,
            fullName,
            email,
            phoneNumber,
            date,
            time,
            message,
        });

        // Redirect to the homepage after successful appointment creation
        res.redirect('/homepage');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error' + error.message);
    }
});

router.get('/appointments', async (req, res) => {
    try {
        // Fetch all appointments from the database
        const appointments = await Appointment.findAll();

        // Send the fetched appointments as JSON
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

module.exports = router;
