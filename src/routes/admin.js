const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For key generation
const nodemailer = require('nodemailer'); // For sending emails
const Admin = require('../models/admin'); // Adjust based on your models
const { error } = require('console');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service
    auth: {
        user: 'nesbitmuretar@gmail.com', // Replace with your email
        pass: 'mulq uxnm zzmy oxbk ', // Replace with your password or app-specific password
    },
});

// Registration route
router.post('/Admin', async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error:'Invalid email address'});
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({error:'Passwords do not match'});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in the database with `key` set to null
        const newAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            key: null, // Key will be generated upon approval
        });
        // Send an approval email to the Admin
        const approvalLink = `http://localhost:3000/approve/${encodeURIComponent(newAdmin.email)}`;
        await transporter.sendMail({
            from: email, // Use the user's email as the sender
            to: 'nesbitmuretar@gmail.com', // Replace with the Admin's email
            subject: 'New User Registration Approval for admin',
            html: `<p>A new user (${firstName} ${lastName}) has registered and is requesting admin privileges. Click <a href="${approvalLink}">here</a> to approve .</p>`,
        });

        res.status(201).json({error:'Registration successful. Awaiting Admin approval.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

// Approval route
router.get('/approve/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user by email
        const user = await Admin.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({error:'User not found'});
        }

        // Generate a unique key and save it to the user's record
        const generatedKey = crypto.randomBytes(16).toString('hex');
        user.key = generatedKey;
        await user.save();

        res.status(200).json({error:'Admin approved successfully. They can now log in.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Login route
router.post('/Admin_login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Admin.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Check if the account is approved
        if (!user.key) {
            return res.status(403).json({error: 'Your account is not approved yet.'});
        }

        // Compare the entered password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({error: 'Incorrect password'});
        }

        // Successful login, redirect to homepage
        res.redirect('/appointments.html');
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
