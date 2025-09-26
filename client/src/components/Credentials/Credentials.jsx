import React, { useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Loader, Loader2 } from "lucide-react";

export default function Credentials() {
  const location = useLocation();
  const { login, setSignupCredentials,signupCredentials, checkUniqueEmail,checkingUniqueEmail, setLoginCredentials,loginCredentials, manualLogin, loggingIn, forgotPassword } = useAuthStore();

  // useEffect(()=>{
  //   console.log("Name: ", signupCredentials.name.length);
  //   console.log("Length: ", signupCredentials.email.split("@"));
  //   console.log("Length: ", signupCredentials.email.split(".com"));
  // })

  return (
    
    <div className="flex flex-col gap-10 pl-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">
          {location.pathname == "/login"
            ? "Welcome Back!"
            : "Create New Account"}
        </h1>
        <p className="text-gray-500 text-xl">
          {location.pathname == "/login"
            ? "Enter your credentials below to access your dashboard."
            : "Get Started with NextFest"}
        </p>
      </div>
      <div className="flex flex-col-reverse justify-center gap-10">
        <form className="flex flex-col justify-center w-[80%] gap-5 text-md" onSubmit={(e)=>e.preventDefault()}>
          {location.pathname == "/signup" && <div className="flex items-center w-full gap-4">
            <div className="flex flex-col justify-center gap-2 w-full">
            <label htmlFor="name">First Name</label>
            <input
              name="firstName"
              type="text"
              value={signupCredentials.firstName || ""}
              onChange={(e)=>{setSignupCredentials({ firstName: e.target.value })}}
              required
              placeholder="First Name"
              className="p-1 py-2 border border-purple-400 rounded-lg focus:bg-gray-100 focus:outline-none focus:border-2 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 w-full">
            <label htmlFor="name">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={signupCredentials.lastName || ""}
              onChange={(e)=>{setSignupCredentials({ lastName: e.target.value })}}
              required
              placeholder="Last Name"
              className="p-1 py-2 border border-purple-400 rounded-lg focus:bg-gray-100 focus:outline-none focus:border-2 focus:border-indigo-500"
            />
          </div>
            </div>}
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              value={location.pathname == "/login" ? (loginCredentials.email || "") :(signupCredentials.email || "")}
              required
              onChange={(e)=>{location.pathname == "/login" ? setLoginCredentials({ email: e.target.value }):setSignupCredentials({ email: e.target.value })}}
              placeholder="Enter Your Email"
              className="p-1 py-2 border border-purple-400 rounded-lg focus:bg-gray-100 focus:outline-none focus:border-2 focus:border-indigo-500"
            />
          </div>
          {location.pathname == "/login" && (
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                value={loginCredentials.password || ""}
                onChange={(e)=>{ setLoginCredentials({ password: e.target.value }) }}
                required
                className="p-1 py-2 border border-purple-400 rounded-lg focus:bg-gray-100 focus:outline-none focus:border-2 focus:border-indigo-500"
                placeholder="Enter Password"
              />
            </div>
          )}
          {location.pathname == "/login" && (
            <div className="flex items-center justify-between text-sm text-blue-600 " onClick={()=>forgotPassword()}>
              <div></div>
              <button className="cursor-pointer"> Forgot Password ?</button>
            </div>
          )}
          {location.pathname == "/signup" && <button
            // disabled={!(signupCredentials.name.trim().length != 0 && signupCredentials.email.length!= 0 && signupCredentials.email.split("@").length > 1 && signupCredentials.email.split(".com").length > 1)}
            onClick={() => {!checkingUniqueEmail && (signupCredentials.firstName.trim().length != 0 && signupCredentials.lastName.trim().length != 0 && signupCredentials.email.length!= 0 && signupCredentials.email.split("@").length > 1 && signupCredentials.email.split(".com").length > 1) ? checkUniqueEmail() : toast.error("Fill all the fields!")}}
            className={`p-3 rounded-lg text-white transition-all duration-200 flex items-center justify-center ${checkingUniqueEmail ? "bg-gray-600/50" : "bg-pink-400 hover:bg-indigo-600"}`}
          >
            {checkingUniqueEmail ? <Loader2 className="animate-spin text-gray-200"/> : "Next"}
          </button>}
          {/* {location.pathname == "/login" && <button
            onClick={() => {manualLogin()}}
            className="bg-pink-400 hover:bg-indigo-600 p-3 rounded-lg text-white transition-all duration-200"
          >
            Next
          </button>} */}
          {location.pathname == "/login" && <button
            // disabled={!(signupCredentials.name.trim().length != 0 && signupCredentials.email.length!= 0 && signupCredentials.email.split("@").length > 1 && signupCredentials.email.split(".com").length > 1)}
            onClick={() => {!loggingIn && ( loginCredentials.email.length!= 0 && loginCredentials.email.split("@").length > 1 && loginCredentials.email.split(".com").length > 1) ? manualLogin() : toast.error("Fill all the fields!")}}
            className={`p-3 rounded-lg text-white transition-all duration-200 flex items-center justify-center ${loggingIn ? "bg-gray-600/50" : "bg-pink-400 hover:bg-indigo-600"}`}
          >
            {loggingIn ? <Loader2 className="animate-spin text-gray-200"/> : "LogIn"}
          </button>}
          <div className="text-center">
            <p>
              {location.pathname == "/login"
                ? "Don't Have an Account ?"
                : "Already Have an Account ?"}
              <Link to={location.pathname == "/login" ? "/signup" : "/login"} className="text-blue-500 mx-1">
                {location.pathname == "/login" ? "SignUp" : "SignIn"}
              </Link>
            </p>
          </div>
        </form>
        <div className="flex items-center gap-3 w-[80%] text-gray-700">
          <hr className="h-0.5 w-[50%]" />
          <p>OR</p>
          <hr className=" h-0.5 w-[50%]" />
        </div>
        <div className="flex items-center w-[80%]" onClick={() => login()}>
          <div className="flex items-center justify-center py-3.5 rounded-lg px-7 gap-5 border-2 border-gray-400/35 shadow-xl mx-auto w-full cursor-pointer hover:scale-102 transition-all duration-200">
            <img src="./google_img.jpg" className="w-7" alt="" />
            <p>Continue With Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}
