import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\NextFest\\server\\.env" });

export const verifyToken = async (req, res, next) => {
  console.log("Inside Auth Middleware");

  const user = req.session?.passport?.user?.user;

  console.log("Google User: ", req.session);

  if (user) {
    const userEmail = user.email;
    const foundUser = await User.findOne({ email: userEmail });

    if (!foundUser)
      return res
        .status(401)
        .json({ msg: "Not Logged In", authenticated: false });

    return next();
  }

  // console.log("Headers: ", req.headers);

  // const authHeader = req.headers['authorization'];
  // if(!authHeader) return res.status(401).json({ msg: "Invalid or Missing Token", authenticated: false });
  // const accessToken = authHeader.split(" ")[1];

  const accessToken = req.cookies.accessToken;
  console.log("Access Token: ", accessToken);
  if (!accessToken) {
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
      .json({ msg: "Invalid or Missing Token", authenticated: false });
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const userEmail = decodedToken.email;

    const foundUser = await User.findOne({ email: userEmail });

    if (!foundUser) {
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
        .json({ msg: "Invalid or Missing Token", authenticated: false });
    }
    console.log(foundUser);

    req.user = foundUser;
    req.accessToken = accessToken;

    return next();
  } catch (err) {
    // console.log("Error in Auth Middleware", err);
    return res.status(401).json({ msg: "JWT Expired!" });
  }
};
