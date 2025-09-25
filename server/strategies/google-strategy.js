import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

dotenv.config({path: "D:\\Mayank Data\\CODING\\NextFest\\server\\.env"})


passport.use(new Strategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    scope: ["email", "profile", "https://www.googleapis.com/auth/calendar.events", "https://mail.google.com/"],
    callbackURL: "http://localhost:5000/api/auth/callback",
    accessType: "offline",
    prompt: "consent",
    approval_prompt: "force"    
}, async(accessToken, refreshToken, profile, done)=>{
    // console.log("Req Cookies: ", req.cookies);
    // if(req.cookies?.accessToken){
    //     console.log("Heyyyy!!!!");

    //     console.log("Profile Inside: ", profile);
    //     const credentialsAccessToken = req.cookies?.accessToken;
    //     console.log("Auth AT: ", credentialsAccessToken);

    //     const decodedToken = jwt.verify(credentialsAccessToken, process.env.ACCESS_TOKEN_SECRET);
    //     console.log("DT: ", decodedToken);
    //     const userEmail = decodedToken.email;

    //     if(profile.emails[0].value != userEmail) throw new Error("Use The Logged In Mail ID Only");
    //     const foundUser = await User.findOne({ email: userEmail });

    //     if(!foundUser) throw new Error("Unuthenticated!");


    //     const updatedUser = await User.findById(foundUser._id, {
    //         googleDetails: {
    //             accessToken: accessToken,
    //             refreshToken: refreshToken,
    //             linkedAt: Date.now()
    //         }
    //     })

    //     return done(null, {updatedUser});
    // }
    // console.log(profile);
    console.log("Access Token: ", accessToken);
    console.log("Refresh Token: ", refreshToken);
    console.log("Profile: ", profile);
    const firstName = profile.displayName.split(" ")[0];
    const lastName = profile.displayName.split(" ")[1];
    const primaryEmail = profile.emails[0].value;
    let profilePic;
    const foundUser = await User.findOne({ email: primaryEmail }).select("-password");

    
    if(foundUser) return done(null, { user: foundUser, accessToken, refreshToken });

    const response = await cloudinary.uploader.upload(profile.photos[0].value, { public_id: `users/${profile.id}/profile` });
    profilePic = response.secure_url;
    console.log("Profile Pic: ", profilePic);

    let isPublicDomain = true;

    if(primaryEmail.split("@")[1] != "gmail.com"){
        isPublicDomain = false;
    }

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: primaryEmail,
        isPublicDomain: isPublicDomain,
        accountLinkedToGoogle: true,
        profilePic: profilePic || "",
        googleDetails: {
            refreshToken: refreshToken,
            profilePic: profilePic,
            email: primaryEmail,
            linkedAt: Date.now()
        }
    });

    const savedUser = await newUser.save();


    return (done(null, {user: savedUser, accessToken, refreshToken}));
}));

passport.serializeUser((userDetails, done)=>{  
    return done(null, userDetails);
});

passport.deserializeUser(async(userDetails, done)=>{
    try{

        const user = userDetails.user;
        const email = user.email;
        const foundUser = await User.findOne({ email: email });
        if(!foundUser) throw new Error("Unauthenticated!");   
        return done(null, user)
    }catch(e){
        return done(e, null);
    }
})


