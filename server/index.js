require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON

const transporter = nodemailer.createTransport({
    service: 'gmail', // or another provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/send-email', async (req, res) => {
    const { name, code } = req.body;

    if (!name || !code) {
        return res.status(400).json({ error: 'Missing name or code' });
    }

    try {
        await transporter.sendMail({
            from: `"Letter Access Notifier" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: `📬 ${name} just opened their letter!`,
            text: `${name} used code: ${code} to access their letter.`
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/api/send-message', async (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ error: 'Missing name or message' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL, // your email
        subject: `📬 New message from ${name}`,
        text: `Message from ${name}:\n\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Error sending message email:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
