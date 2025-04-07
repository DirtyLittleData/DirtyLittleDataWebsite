const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_MSG_LEN = 1000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.json());

app.post("/contact", async (req, res) => {
    const { name, email, subject, message, recaptchaToken } = req.body;

    if (!email || !message || message.length > MAX_MSG_LEN) {
        return res.status(400).send("Invalid input");
    }

    // try {
    //     const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    //     const params = new URLSearchParams();
    //     params.append("secret", process.env.RECAPTCHA_SECRET);
    //     params.append("response", recaptchaToken);

    //     const response = await axios.post(verifyUrl, params);
    //     const { success } = response.data;

    //     if (!success) {
    //         return res.status(403).send("Failed reCAPTCHA verification.");
    //     }
    // } catch (err) {
    //     console.error("reCAPTCHA error:", err.response?.data || err.message);
    //     return res.status(500).send("reCAPTCHA verification failed.");
    // }

    const msg = {
        to: "BlevinsJonny@gmail.com",
        from: "admin@dirtylittledata.com",
        subject: subject || "New contact form submission",
        text: `From: ${name || "No name provided"} <${email}>\n\nMessage: ${message}`
    };

    try {
        await sgMail.send(msg);
        res.status(200).send("Message sent successfully");
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
        res.status(500).send("Error sending email");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});