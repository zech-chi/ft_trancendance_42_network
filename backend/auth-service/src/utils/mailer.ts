import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER_SERVICE|| "",  // Ethereal test user
            pass: process.env.MAIL_USER_PASSWORD// Ethereal password
        }
    });

    const info = await transporter.sendMail({
        from: `"2FA System" <${process.env.MAIL_USER_PASSWORD}>`,  // must match Ethereal account
        to: to,                                           // pass recipient here
        subject,
        html
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
