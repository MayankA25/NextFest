import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path:"D:\\Mayank Data\\CODING\\NextFest\\server\\.env" })

const getTransporter = (userEmail, accessToken, refreshToken)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            // clientId: process.env.OAUTH_CLIENT_ID,
            // clientSecret: process.env.OAUTH_CLIENT_SECRET,
            // user: userEmail,
            // accessToken: accessToken,
            // refreshToken: refreshToken
            user: "mayank.a125052@gmail.com",
            pass: process.env.GOOGLE_APP_PASSWORD
        },
        pool: true,
        maxConnections: 5,
        rateLimit: 5,
    });
    return transporter;
}


export const sendMail = async(senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment)=>{
    console.log("Inside Sending Mail To: ", recipient);
    try{
        const transporter = getTransporter(senderMail, accessToken, refreshToken);
        const mailOptions = {
            from: senderMail,
            to: recipient,
            subject: subject,
            cc: cc,
            bcc: bcc,
            subject: subject,
            html: message,
            attachment: attachment
        }

        await transporter.sendMail(mailOptions);
        console.log("Email Sent.");
    }catch(e){
        console.log(e);
    }
}