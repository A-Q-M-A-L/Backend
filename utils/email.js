import nodemailer from 'nodemailer';
import CatchAsync from './catchAsync.js';

const sendEmail = CatchAsync( async (Option) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: "aqmalfaraz@gmail.com", // generated ethereal user
            pass: "hAcker!!1", // generated ethereal password
        },
    });

    const mailOptions = {
        from: '"Aqmalfaraz" <aqmalfaraz@gmail.com>', // sender address
        to: Option.email, // list of receivers
        subject: Option.subject, // Subject line
        text: Option.message, // plain text body
    }
      await transporter.sendMail(mailOptions);
})