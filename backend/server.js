const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // ⬅️ Add this
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ⬇️ Add this after bodyParser
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: "Too many requests from this IP. Please try again later."
});
app.use('/contact', limiter); // apply to /contact only

// Allow CORS if frontend is on a different port (optional for local testing)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// POST /contact route
app.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        replyTo: `${name} <${email}>`,
        to: process.env.EMAIL_USER,
        subject: subject || "New Contact Form Submission",
        text: `
        Name: ${name}
        Email: ${email}
        Message:
        ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent!');
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('There was an error sending your message.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
