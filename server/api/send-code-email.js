// api/send-code-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { name, code } = req.body;

    if (!name || !code) {
        return res.status(400).json({ error: 'Missing name or code' });
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
            to: process.env.RECEIVER_EMAIL, // your email
            subject: '🔓 Someone opened a letter',
            html: `<p><strong>${name}</strong> just unlocked their letter with code: <code>${code}</code></p>`,
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send email' });
    }
}
