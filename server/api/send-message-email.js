// api/send-message-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: 'Missing name or message' });
        }

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `"FromPNWithLove" <${process.env.EMAIL_USER}>`,
                to: process.env.RECEIVER_EMAIL,
                subject: '💌 New message from letter reader',
                html: `<p><strong>${name}</strong> left a message:</p><blockquote>${message}</blockquote>`,
            });

            return res.status(200).json({ message: 'Message sent' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
