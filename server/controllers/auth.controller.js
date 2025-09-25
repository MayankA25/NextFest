import { User } from "../models/User.js";
import { sendMail } from "../utils/email.js";
import { mailQueue } from "../utils/queue.js";
import { generateRandomOTP } from "../utils/generateOTP.js";
import { connection } from "../utils/redis.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\NextFest\\server\\.env" });

// Redirect URL after OAUTH2.0 Google Login
export const callback = (req, res) => {
  console.log("Session: ", req.session);
  return res.redirect("http://localhost:5173/main");
};

export const linkCallback = (req, res) => {
  console.log("Link User: ", req.user);
  console.log("Link Session: ", req.session);
  return res.redirect("http://localhost:5173/main/account");
};

// Getting User For Checking If the User is Logged In or Not
export const getUser = async (req, res) => {
  try {
    console.log("Inside Getting User");
    console.log("User: ", req?.user);
    // console.log(req.session);
    const foundUser = await User.findOne({
      email: req.session?.passport?.user?.user?.email,
    });
    // if(!foundUser) return res.status(401).json({ msg: "Unauthenticated", authenticated: false });
    if (!foundUser) {
      console.log("Cookies: ", req.cookies);
      const refreshToken = req.cookies?.refreshToken;
      console.log("Refresh Token: ", refreshToken);
      console.log("Access Token: ", req.accessToken);

      if (!refreshToken) {
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: false,
          samesite: "strict",
        });

        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          samesite: "strict",
        });
        return res
          .status(401)
          .json({ msg: "Unauthenticated", authenticated: false });
      }

      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log(decodedToken);

      const userEmail = decodedToken.email;

      const jwtFoundUser = await User.findOne({ email: userEmail }).select(
        "-password"
      );

      if (!jwtFoundUser) {
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: false,
          samesite: "strict",
        });

        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          samesite: "strict",
        });

        return res
          .status(401)
          .json({ msg: "Unauthenticated", authenticated: false });
      }

      // const newAccessToken = jwt.sign({ userId: jwtFoundUser._id, email: jwtFoundUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

      return res.status(200).json({ user: jwtFoundUser, authenticated: true });
    }

    return res
      .status(200)
      .json({ authenticated: true, user: foundUser });
  } catch (e) {
    console.log("Error While Getting User: ", e);
    return res
      .status(401)
      .json({ msg: "Internal Server Error", authenticated: false });
  }
};

// Getting All Users

export const getAllUsers = async(req, res)=>{
  try{
    const foundUsers = await User.find({email: {$ne: req.user.email || req.session.passport.user.user.email}});
    return res.status(200).json({ allUsers: foundUsers });
  }catch(e){
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" })
  }
}


// Sending OTP via email
export const sendOTP = async (req, res) => {
  const { recipientEmail, reset } = req.body;
  try {
    // await mailQueue.add("mailQueue", )
    // senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment

    const otp = generateRandomOTP();

    // req.session.otp = {
    //     value: otp,
    //     time: Date.now(),
    //     verified: false
    // };

    // console.log(req.session);

    await connection.set(
      `otp${reset ? "-reset" : ""}:${recipientEmail}`,
      otp,
      "EX",
      300
    );

    // console.log(req.session);
    const senderMail = "mayank.a125052@gmail.com";
    const recipient = recipientEmail;
    const accessToken = "";
    const refreshToken = "";
    const subject = reset
      ? "Reset NextFest Password"
      : "NextFest Verification Code";
    const message = reset
      ? `<h3>One Time Password(OTP) to reset your password in NextFest is: <br></br <br></br> <h1>${otp}</h1></h3>`
      : `<h3>One Time Password(OTP) to complete your login in NextFest is: <br></br <br></br> <h1>${otp}</h1></h3>`;
    const cc = [];
    const bcc = [];
    const attachment = [];
    // await sendMail('mayank.a125052@gmail.com', 'mikkuarora25@gmail.com', accessToken, refreshToken, subject, message, cc, bcc, attachment);
    await mailQueue.add(
      "mailQueue",
      {
        senderMail,
        recipient,
        accessToken,
        refreshToken,
        subject,
        message,
        cc,
        bcc,
        attachment,
      },
      { removeOnComplete: true, removeOnFail: 1000 }
    );
    return res.status(200).json({ msg: "Email Has Been Sent!", sent: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Error While Sending Mail" });
  }
};

// Verifying OTP received from frontend
export const verifyotp = async (req, res) => {
  const { enteredOtp, email, reset } = req.body;
  try {
    // const otp = req.session.otp;

    const storedOtp = await connection.get(
      `otp${reset ? "-reset" : ""}:${email}`
    );

    if (!storedOtp) {
      return res.status(400).json({ msg: "OTP Expired" });
    }

    console.log("Stored OTP: ", storedOtp);

    if (Number.parseInt(storedOtp) !== enteredOtp) {
      // req.session.otp.verified = false;
      // console.log(req.session.otp);
      return res.status(401).json({ msg: "Incorrect OTP", verified: false });
    }

    // req.session.otp.verified = true;
    // console.log(req.session.otp);

    return res
      .status(200)
      .json({ msg: "OTP Verified Successfully!", verified: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const checkUniqueEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser)
      return res
        .status(400)
        .json({ msg: "Email Already Exists!", duplicate: true });
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ToDo:- I have to keep a check that OTP should be verified before creating an account as without it just acts as a normal api that anybody can access by knowing endpoints.
export const manualSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (email.trim().length == 0 || password.trim().length == 0) {
      return res
        .status(401)
        .json({ msg: "Provide Credentials Properly", authenticated: false });
    }

    const foundUser = await User.findOne({ email: email });
    if (foundUser)
      return res
        .status(400)
        .json({ msg: "User Already Exists", authenticated: false });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let isPublicDomain = false;

    if (email.split("@")[1] == "gmail.com") isPublicDomain = true;

    const newUser = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      isPublicDomain: isPublicDomain,
    });

    const savedUser = await newUser.save();

    const accessToken = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });

    return res.status(201).json({
      msg: "Logged In Successfully!",
      authenticated: true,
      user: savedUser,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ToDo:- I have to keep a check that OTP should be verified before creating an account as without it just acts as a normal api that anybody can access by knowing endpoints.
export const manualLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email });
    const foundUser2 = await User.findOne({ email: email }).select("-password");

    if (!foundUser) return res.status(401).json({ msg: "Invalid Credentials" });

    const comparePassword = bcrypt.compareSync(password, foundUser.password);

    if (!comparePassword)
      return res.status(401).json({ msg: "Invalid Credentials!" });

    const accessToken = jwt.sign(
      { userId: foundUser._id, email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { userId: foundUser._id, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });

    return res.status(200).json({
      msg: "Logged In Successfully",
      authenticated: true,
      user: foundUser2,
    });
  } catch (e) {
    // console.log(e);
    return res
      .status(500)
      .json({ msg: "Error While Logging In", authenticated: false });
  }
};

// Refresh The Token Before It Expires or Expired

export const refreshToken = async (req, res) => {
  console.log("Refreshing Token");
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken){
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        samesite: "strict"
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure:false,
        samesite: "strict"
      })
    return res
    .status(401)
    .json({ msg: "Unauthenticated", authenticated: false });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const userEmail = decodedToken.email;

    const foundUser = await User.findOne({ email: userEmail }).select(
      "-password"
    );

    if (!foundUser){
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        samesite: "strict"
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure:false,
        samesite: "strict"
      })
      return res
      .status(401)
      .json({ msg: "Unauthenticated", authenticated: false });
    }

    const newAccessToken = jwt.sign(
      { userId: foundUser._id, email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    console.log("Nee Access Token: ", newAccessToken);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });
    return res.status(200).json({ user: foundUser, authenticated: true });
  } catch (e) {
    // console.log(e);
    return res
      .status(401)
      .json({ msg: "Unauthenticated", authenticated: false });
  }
};

export const submitForm = async (req, res) => {
  const { id, phoneNumber, regNo, interests, profilePicture } = req.body;
  console.log("profilePic: ", profilePicture);
  try {
    console.log(phoneNumber);
    console.log(regNo);
    console.log(interests);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        phone: phoneNumber || undefined,
        regNo: regNo || undefined,
        initialFormSubmitted: true,
        interests: interests,
        profilePic: profilePicture,
      },
      { new: true }
    ).select("-password");

    if(req && req.session?.passport?.user?.user){
      req.session.passport.user.user.initialFormSubmitted = true;
    }

    console.log("Updated User: ", updatedUser);
    return res.status(200).json({ updatedUser: updatedUser });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Destroying Session Of Current User
export const logout = async (req, res) => {
  try {
    if (req.session?.passport?.user?.user) {
      req.session.destroy();
    } else {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        samesite: "strict",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        samesite: "strict",
      });
    }
    // console.log("Session After LogOut: ", req.session);
    return res
      .status(200)
      .json({ msg: "Logged Out Successfully", authenticated: false });
  } catch (e) {
    console.log("Error While Logging Out: ", e);
    return;
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (email.trim().length == 0 || newPassword.trim().length == 0)
      return res.status(400).json({ msg: "Provide The Fields Correctly!" });

    const foundUser = await User.findOne({ email: email });

    if (!foundUser)
      return res.status(400).json({ msg: "User Does Not Exists!" });

    const genSalt = await bcrypt.genSalt(10);

    const newHashedPassword = await bcrypt.hash(newPassword, genSalt);

    await User.findOneAndUpdate(
      { email: email },
      { password: newHashedPassword },
      { new: true }
    );

    return res.status(200).json({ msg: "Password Updated" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Sever Error" });
  }
};

export const uploadResume = async(req, res)=>{
  const { id, resumeUrl } = req.body;

  try{
    const updatedUser = await User.findByIdAndUpdate(id, {
      resume: resumeUrl
    }, {new: true});

    return res.status(200).json({ updatedser: updatedUser });
  }catch(e){
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" })
  }
}