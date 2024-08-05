import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import CatchAsync from './CatchAsync.js';

// Load environment variables from .env file
dotenv.config({
    path: '../.env'
});
console.log(process.env.EMAIL_USER+ "ehllsdf" + process.env.EMAIL_PASS);


const sendEmail = CatchAsync(async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // use environment variables for security
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Aqmalfaraz" <${process.env.EMAIL_USER}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});

export default sendEmail;

