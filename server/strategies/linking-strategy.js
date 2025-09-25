import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\NextFest\\server\\.env" });

passport.use(
  "link-google",
  new Strategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/linkcallback",
      accessType: "offline",
      prompt: "consent",
      approval_prompt: "force",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log("Access Token: ", accessToken);
      console.log("Refresh Token: ", refreshToken);

      console.log("Authroized Access Token: ", req.cookies?.accessToken);

      const authAccessToken = req.cookies?.accessToken;

      const decodedToken = jwt.verify(
        authAccessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const email = decodedToken.email;
      let profilePic;

      if (profile.emails[0].value != email)
        throw new Error("Use The Logged In Email Id Only");

      const foundUser = await User.findOne({ email: email });

      if (!foundUser) throw new Error("Unauthenticated");

      const response = await cloudinary.uploader.upload(
        profile.photos[0].value,
        { public_id: `users/${profile.id}/profile` }
      );
      profilePic = response.secure_url;

      const updatedUser = await User.findByIdAndUpdate(foundUser._id, {
        accountLinkedToGoogle: true,
        googleDetails: {
          // accessToken: accessToken,
          refreshToken: refreshToken,
          email: email,
          profilePic: profilePic || "",
          linkedAt: Date.now(),
        },
      });

      return done(null, { user: updatedUser, isLinking: true });
    }
  )
);

passport.serializeUser(async (userDetails, done) => {
  console.log("Inside Serializing...");
  return done(null, userDetails);
});

passport.deserializeUser(async (userDetails, done) => {
  console.log("Inside Deserializing");
  try {
    const user = userDetails.user;
    const email = user.email;

    const foundUser = await User.findOne({ email: email });

    if (!foundUser) throw new Error("Unauthenticated!");
    return done(null, user);
  } catch (e) {
    console.log(e);
    return done(e, null);
  }
});
