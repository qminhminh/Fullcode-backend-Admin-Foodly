const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

async function sendVerificationEmail(userEmail, name){

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userEmail,
        subject: "Foodly Driver Verification",
        html: `<h2>Congratulations! Your Foodly Driver Has Been Verified</h2>

        <p>Dear ${name},</p>
    
        <p>We are thrilled to inform you that your driver account on Foodly has been successfully verified! Congratulations on completing the verification process.</p>
    
        <p>Restaurants can now discover your driver account with confidence, knowing that it has been verified by our team. This verification enhances your driver account's visibility and credibility on the Foodly platform.</p>
    
        <p>Thank you for choosing Foodly. We appreciate your commitment to providing accurate and up-to-date information for our users.</p>
    
        <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at [Your Support Email] or [Your Support Phone Number].</p>
    
        <p>Best regards,</p>
    
        <p>Dre<br>
        The Creator<br>
        Foodly Support Team</p>`

    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent");
    } catch (error) {
        console.log("Email sending failed with an error: ", error);
    }
}


module.exports = sendVerificationEmail;