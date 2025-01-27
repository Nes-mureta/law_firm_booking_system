const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointments');

router.post('/book-appointment', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, date, time, message } = req.body;

        // Validate time range (8:00 AM to 4:00 PM)
        const appointmentTime = new Date(`1970-01-01T${time}:00Z`); // Assuming time is in HH:mm format
        const startTime = new Date('1970-01-01T08:00:00Z');
        const endTime = new Date('1970-01-01T16:00:00Z');

        if (appointmentTime < startTime || appointmentTime > endTime) {
            return res.status(400).json({ error: 'Appointment service is offered between 8:00 AM and 4:00 PM, please adjust the date accordingly and try again.' });
        }

        // Check for duplicate appointment with the same date and time
        const existingAppointment = await Appointment.findOne({
            where: {
                date: req.body.date, // Ensure 'date' is in 'YYYY-MM-DD' format
                time: req.body.time, // Ensure 'time' is in 'HH:mm' or 'HH:mm:ss' format
            }
        });
        

        if (existingAppointment) {
            return res.status(400).json({ error: 'Another appointment is already scheduled for this date and time. Please choose a different date or time.' });
        }

        // Create the appointment in the database
        const newAppointment = await Appointment.create({
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
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
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
