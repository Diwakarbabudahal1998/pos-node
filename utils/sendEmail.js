const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    //Create Email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    //Options Fro Sending Email
    const options = {
        from: sent_from,
        to: send_to,
        reply: reply_to,
        subject: subject,
        html: message
    }

    // Send Email
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log("Mail error", err);
        } else {
            console.log("Mail Success Info", info);
        }

    });
};
module.exports = sendEmail;