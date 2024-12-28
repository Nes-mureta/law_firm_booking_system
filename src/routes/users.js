// src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, userType, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in the database
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            userType,
            password: hashedPassword,
        });

        //res.status(201).json(newUser);
        res.redirect('/homepage');
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found check email and passcode' });
        }

        // Compare the entered password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Successful login, redirect to homepage
        res.redirect('/homepage');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error please try again' });
    }
});

module.exports = router;
