// server.js
const express = require('express');
const path = require('path');
const sequelize = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./src/routes/users');
const appointmentRoutes = require('./src/routes/appointments');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', userRoutes);
app.use('/', appointmentRoutes);
app.use(appointmentRoutes)
// Connect to the database
sequelize.sync()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

app.get('/homepage', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
    });
    
app.get('/appointment-booking', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'appointment-booking.html'));
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
