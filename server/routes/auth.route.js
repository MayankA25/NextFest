import { Router } from "express";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import "../strategies/linking-strategy.js";
import "../strategies/google-strategy.js";
// import { Str }
import {
  callback,
  checkUniqueEmail,
  getAllUsers,
  getUser,
  linkCallback,
  logout,
  manualLogin,
  manualSignUp,
  refreshToken,
  resetPassword,
  sendOTP,
  submitForm,
  uploadResume,
  verifyotp,
} from "../controllers/auth.controller.js";
import "../strategies/google-strategy.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  return res.json({ msg: "Hello From Auth" });
});
authRouter.get("/getuser", verifyToken, getUser);

// For OAuth2.0 Login
authRouter.get(
  "/login",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events",
      "https://mail.google.com/",
    ],
    accessType: "offline",
    prompt: "consent",
    approval_prompt: "force",
    callbackURL: "http://localhost:5000/api/auth/callback"
  })
);
// Failure Redirect ----> Incase the login fails
// ToDo:- Create a failure handling page for this.
authRouter.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  callback
);

// With same strategy i cannot link the google account as its taking only the default url which is passed in the strategy
// TODO:- Create new strategy for the linking.
authRouter.get(
  "/linkgoogle",
  passport.authorize("link-google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events",
      "https://mail.google.com/",
    ],
    accessType: "offline",
    prompt: "consent",
    approval_prompt: "force",
    callbackURL: "http://localhost:5000/api/auth/linkcallback"
  })
);
authRouter.get("/linkcallback", passport.authorize("link-google", { failureRedirect: "/linkfailed" }), linkCallback);
authRouter.post("/sendotp", sendOTP);
authRouter.post("/verifyotp", verifyotp);
authRouter.post("/checkunique", checkUniqueEmail);
authRouter.post("/signup", manualSignUp);
authRouter.post("/login", manualLogin);
authRouter.get("/refresh", refreshToken);
authRouter.put("/submitform", submitForm);
authRouter.post("/logout",verifyToken, logout);
authRouter.post("/resetpassword", resetPassword);
authRouter.get("/getallusers", verifyToken, getAllUsers);
authRouter.post("/uploadresume", verifyToken, uploadResume)

export default authRouter;
