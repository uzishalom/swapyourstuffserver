const nodemailer = require("nodemailer")
const config = require("config");

const sendEmail = ((email, subject, message, callback) => {

    const transporter = nodemailer.createTransport({
        service: config.get("sendEmailServiceName"),
        auth: {
            user: config.get("sendEmailUsername"),
            pass: config.get("sendEmailPassword")
        }
    });

    const mailOptions = {
        from: config.get("sendEmailFromEmail"),
        to: email,
        subject: subject,
        text: message
    };

    //self signed certificate in certificate chain"
    transporter.sendMail(mailOptions, callback);
})


module.exports = sendEmail;