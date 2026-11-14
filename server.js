require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.urlencoded({ extended: false, limit: '20kb' }));

for (const directory of [
    '3D Abstract Ball',
    'css',
    'Earth Lines Sphere',
    'fonts',
    'images',
    'Liquids Wavy',
    'media',
    'Simple Strings',
    'solid color',
    'Water Waves',
    'js'
]) {
    app.use(`/${directory}`, express.static(path.join(__dirname, directory)));
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function respond(req, res, status, title, message) {
    const accept = req.get('accept') || '';
    if (req.xhr || accept.includes('application/json')) {
        return res.status(status).json({ success: status < 400, message });
    }

    res.status(status).type('html').send(
        '<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><title>'
        + escapeHtml(title)
        + '</title><body><h1>'
        + escapeHtml(title)
        + '</h1><p>'
        + escapeHtml(message)
        + '</p><p><a href="/">Back to contact form</a></p></body></html>'
    );
}

function getMailConfig() {
    const host = (process.env.SMTP_HOST || '').trim();
    const rawPort = (process.env.SMTP_PORT || '').trim();
    const smtpPort = Number(rawPort);
    const username = (process.env.SMTP_USER || '').trim();
    const password = (process.env.SMTP_PASS || '').trim();
    const fromAddress = (process.env.MAIL_FROM || '').trim();
    const toAddresses = (process.env.MAIL_TO || '')
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);
    const secureSetting = (process.env.SMTP_SECURE || '').trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !host
        || !/^\d+$/.test(rawPort)
        || !Number.isInteger(smtpPort)
        || smtpPort < 1
        || smtpPort > 65535
        || !username
        || !password
        || !emailPattern.test(fromAddress)
        || toAddresses.length === 0
        || toAddresses.some((address) => !emailPattern.test(address))
        || !['', 'true', 'ssl', 'tls', 'starttls'].includes(secureSetting)
    ) {
        return null;
    }

    return {
        host,
        port: smtpPort,
        secure: secureSetting === 'true' || secureSetting === 'ssl',
        requireTLS: secureSetting === 'tls' || secureSetting === 'starttls',
        auth: { user: username, pass: password },
        from: {
            address: fromAddress,
            name: (process.env.MAIL_FROM_NAME || '').trim() || 'Contact Form'
        },
        to: toAddresses
    };
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
    const fields = {};
    for (const field of ['email', 'phone', 'message']) {
        if (typeof req.body[field] !== 'string') {
            return respond(req, res, 400, 'Invalid submission', 'Please complete every field with valid text.');
        }
        fields[field] = req.body[field].trim();
    }

    const budget = typeof req.body['budget-range'] === 'string'
        ? req.body['budget-range'].trim()
        : '';
    const allowedBudgets = [
        'Under 5,000',
        '5,000 - 10,000',
        '10,000 - 20,000',
        '20,000 - 50,000',
        'Over 50,000'
    ];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
        !fields.email
        || !fields.phone
        || !fields.message
        || !emailPattern.test(fields.email)
        || fields.email.length > 254
        || fields.phone.length > 20
        || fields.message.length > 2000
        || (budget && !allowedBudgets.includes(budget))
    ) {
        return respond(req, res, 400, 'Invalid submission', 'Please enter valid details and complete every field.');
    }

    const config = getMailConfig();
    if (!config) {
        console.error('Contact form email configuration is incomplete or invalid.');
        return respond(req, res, 500, 'Unable to send message', 'The email service is not configured correctly. Please try again later.');
    }

    const safeEmail = escapeHtml(fields.email);
    const safePhone = escapeHtml(fields.phone);
    const safeBudget = escapeHtml(budget || 'Not specified');
    const safeMessage = escapeHtml(fields.message).replace(/\r?\n/g, '<br>');
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        requireTLS: config.requireTLS,
        auth: config.auth
    });

    try {
        await transporter.sendMail({
            from: { name: config.from.name, address: config.from.address },
            to: config.to,
            replyTo: { address: fields.email },
            subject: 'Portfolio contact form inquiry',
            text: `Email: ${fields.email}\nPhone: ${fields.phone}\nBudget: ${budget || 'Not specified'}\n\n${fields.message}`,
            html: `<p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Budget:</strong> ${safeBudget}</p><p><strong>Message:</strong><br>${safeMessage}</p>`
        });
    } catch (error) {
        console.error('Contact form email failed:', error.message);
        return respond(req, res, 500, 'Unable to send message', 'Your message could not be sent right now. Please try again later.');
    }

    return respond(req, res, 200, 'Message sent', 'Thank you! Your message has been sent successfully.');
});

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
}

app.listen(port, () => {
    console.log(`Contact form server listening on port ${port}`);
});
