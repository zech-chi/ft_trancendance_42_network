import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "youssef.arabic15@gmail.com",  // Ethereal test user
            pass: "puqp nnna csmc jrry"         // Ethereal password
        }
    });

    const info = await transporter.sendMail({
        from: '"2FA System" <youssef.arabic15@gmail.com>',  // must match Ethereal account
        to: to,                                           // pass recipient here
        subject,
        html
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
