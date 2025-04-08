const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "POST");
    return res.status(200).json({});
  }
  next();
});

app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!email || !message || message.length > 1000) {
    return res.status(400).send("Invalid input");
  }

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

module.exports.handler = serverless(app);