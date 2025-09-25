import { Worker } from "bullmq";
import { sendMail } from "./email.js";
import { connection } from "./redis.js";

connection.on("connect", ()=>{
    console.log("Connection of Redis established");
})

// connection.on("error", (err)=>{
//     console.log("Error While Connecting To Redis")
// })

const worker = new Worker("mailQueue", async(job)=>{
    console.log("Sending Mail To: ", job.data.recipient);
    const { senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment } = job.data;
    await sendMail(senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment)
}, {connection: connection});


worker.on("completed", (job)=>{
    console.log("Email Sent Successfully To: ", job.data.recipient);
})

worker.on("failed", (job)=>{
    console.log("Error While Sending Mail To: ", job.data.recipient);
})