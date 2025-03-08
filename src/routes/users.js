const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service
    auth: {
        user: 'nesbitmuretar@gmail.com', // Replace with your email
        pass: 'mulq uxnm zzmy oxbk ', // Replace with your password or app-specific password
    },
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, userType, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'The email already has an active account.' });
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
            key: userType === 'lawyer' ? null : undefined, // Key will be generated upon approval for lawyers
        });

        if (userType === 'lawyer') {
            // Send an approval email to the Admin
            const approvalLink = `http://localhost:3000/approve-lawyer/${encodeURIComponent(newUser.email)}`;
            await transporter.sendMail({
                from: email, // Use the user's email as the sender
                to: 'nesbitmuretar@gmail.com', // Replace with the Admin's email
                subject: 'New Lawyer Registration Approval',
                html: `<p>A new lawyer (${firstName} ${lastName}) has registered and is requesting approval. Click <a href="${approvalLink}">here</a> to approve.</p>`,
            });

            res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
        } else {
            res.status(201).json({ message: 'Registration successful.', redirectUrl: '/homepage' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Approval route for lawyers
router.get('/approve-lawyer/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a unique key and save it to the user's record
        const generatedKey = crypto.randomBytes(16).toString('hex');
        user.key = generatedKey;
        await user.save();

        res.status(200).json({ message: 'Lawyer approved successfully. They can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found. Please check your email and password.' });
        }

        // If the user is a lawyer, check if the account is approved
        if (user.userType === 'lawyer' && !user.key) {
            return res.status(403).json({ error: 'Your account is not approved yet.' });
        }

        // Compare the entered password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Successful login, redirect based on user type
        if (user.userType === 'lawyer') {
            res.status(200).json({ message: 'Login successful.', redirectUrl: '/appointments.html' });
        } else {
            res.status(200).json({ message: 'Login successful.', redirectUrl: '/homepage' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error. Please try again.' });
    }
});

module.exports = router;