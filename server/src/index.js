import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "../routes/auth.route.js";
import session from "express-session";
import Mongo from "connect-mongo";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import todoRouter from "../routes/todo.routes.js";
import fileRouter from "../routes/file.route.js";

dotenv.config("D:\\Mayank Data\\CODING\\NextFest\\server\\.env");

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected To Mongo DB...")
}).catch((e)=>{
    console.log("Error While Connecting To Mongo: ");
})
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    cookie:{
        maxAge: 5 * 60000,
        secure: false,
        httpOnly: true
    },
    store: Mongo.create({
        client: mongoose.connection.getClient()
    })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res)=>{
    return res.json({ msg: "Hello From Express Server" })
})

app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);
app.use("/api/files", fileRouter);


app.listen(process.env.PORT, ()=>{
    console.log("Listening On The PORT: ", process.env.PORT);
})