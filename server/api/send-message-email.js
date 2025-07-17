// api/send-message-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

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

        res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
}
