import React, { useEffect } from "react";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function PasswordConfirmation() {
  const { signupCredentials, setSignupCredentials, manualSignup,creatingAccount, resetPassword, count } = useAuthStore();

  // const [showPassword, setPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1); // prevents going back
    };
    return () => {
      window.onpopstate = null;
    };
  }, [count]);

  return (
    <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col justify-center w-full h-full gap-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-4xl">{localStorage.getItem("reset") ? "Reset Password" : "Create Password"}</h1>
        <p className="text-2xl text-gray-500">{localStorage.getItem("reset") ? "Reset Your Password" : "Create Your Password"}</p>
      </div>
      <div className="flex flex-col justify-center w-[80%] mx-auto gap-8">
        <div className="flex flex-col justify-center w-full gap-2 relative">
          <label htmlFor="password" className="text-lg">
            {localStorage.getItem("reset") ? "New Password" : "Password"}
          </label>
          <input
            name="password"
            type={passwordType}
            value={signupCredentials.password}
            required
            onChange={(e) => {
              setSignupCredentials({ password: e.target.value });
            }}
            placeholder="Enter Password"
            className="p-1 py-2 border border-purple-400 rounded-lg focus:bg-gray-100 focus:outline-none focus:border-2 focus:border-indigo-500"
          />
          {passwordType == "text" ? (
            <EyeOff
              className="absolute right-4 top-[58%] text-gray-500"
              onClick={() => setPasswordType("password")}
            />
          ) : (
            <Eye
              className="absolute right-4 top-[58%] text-gray-500"
              onClick={() => setPasswordType("text")}
            />
          )}
        </div>
        <div className="flex flex-col justify-center w-full gap-2 relative">
          <label htmlFor="confirmPassword" className="text-lg">
            {localStorage.getItem("reset") ? "Confrim New Password" : "Confirm Password"}
          </label>
          <input
            name="confirmPassword"
            type={confirmPasswordType}
            value={signupCredentials.confirmPassword}
            required
            onChange={(e) => {
              setSignupCredentials({ confirmPassword: e.target.value });
            }}
            placeholder="Confirm Your Password"
            className="p-1 py-2 border border-purple-400 rounded-lg focus:bg-gray-100 focus:outline-none focus:border-2 focus:border-indigo-500"
          />
          {confirmPasswordType == "text" ? (
            <EyeOff
              className="absolute right-4 top-[58%] text-gray-500"
              onClick={() => setConfirmPasswordType("password")}
            />
          ) : (
            <Eye
              className="absolute right-4 top-[58%] text-gray-500"
              onClick={() => setConfirmPasswordType("text")}
            />
          )}
        </div>
      </div>
      <div className="w-[80%] mx-auto">
        {/* <button
          className="w-full bg-pink-500 p-2.5 text-white rounded-lg hover:bg-indigo-500 transition-all duration-200"
          onClick={() => manualSignup()}
        >
          Create Account
        </button> */}
        <button
          className={`p-3 rounded-lg text-white transition-all duration-200 flex items-center justify-center ${creatingAccount ? "bg-gray-600/50" : "bg-pink-400 hover:bg-indigo-600"} w-full`}
          onClick={() => {
            localStorage.getItem("reset") ? resetPassword() : manualSignup();
          }}
        >
          {creatingAccount ? <Loader2 className="animate-spin text-gray-200"/> : "Create Account"}
        </button>
      </div>
    </form>
  );
}
