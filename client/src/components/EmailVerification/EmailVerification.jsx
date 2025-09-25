import React, { useState } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EmailVerification() {
  const { count, sendOtp, signupCredentials, verifyOtp, verifyingOtp } = useAuthStore();

  const [emailCode, setEmailCode] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
    window.history.go(1); // prevents going back
  };
    if (count == 1 && localStorage.getItem("otp") != "sent") {
      console.log("Sending OTP");
      toast.promise(
        sendOtp(localStorage.getItem("reset") ? localStorage.getItem("reset-email") :(signupCredentials.email || localStorage.getItem("email")), localStorage.getItem("reset") == true),
        {
          loading: "Sending...",
          success: "OTP has been sent",
          error: "Error While Sending OTP"
        }
      )
      // localStorage.setItem("firstName", signupCredentials.firstName);
      // localStorage.setItem("lastName", signupCredentials.lastName);
      // localStorage.setItem("email", signupCredentials.email);
    }
    return ()=>{
      window.onpopstate = null;
    }
  }, [count]);

  const handleInputChange = (val, index) => {
    const temp = [...emailCode];
    if (
      (Number.parseInt(val) >= 0 && Number.parseInt(val) <= 9) ||
      val.length == 0
    ) {
      temp[index] = val;
      setEmailCode(temp);
      if (index + 1 <= emailCode.length - 1) {
        const nextInputElem = document.getElementById(`input_${index + 1}`);
        nextInputElem.focus();
        console.log(nextInputElem);
      }
    }

    console.log("Email Code: ", temp);
  };

  const handleKeyDown = (val, index) => {
    console.log("Index: ", index);
    const temp = [...emailCode];
    if (val == "Backspace") {
      temp[index] = "";
      if (index - 1 >= 0) {
        temp[index - 1] = "";
        const prevInputElem = document.getElementById(`input_${index - 1}`);
        prevInputElem.focus();
        console.log(prevInputElem);
      }
      setEmailCode(temp);
    }

    console.log(temp);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-15 m-auto">
      <div className="flex flex-col justify-center text-center gap-2">
        <h1 className="font-bold text-3xl">Email Verification</h1>
        <p className="text-xl text-gray-500">
          An OTP has been sent to your mail for verification
        </p>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center justify-center gap-3">
          {[...Array(6)].map((element, index) => {
            return (
              <input
                key={index}
                id={`input_${index}`}
                type="number"
                value={emailCode[index].length != 0 ? emailCode[index] : ""}
                className="border-1 focus:border-2 focus:border-black focus:outline-none border-black w-20 h-20 rounded-lg text-4xl text-center"
                onChange={(e) => {
                  handleInputChange(e.target.value, index);
                }}
                onKeyDown={(e) => handleKeyDown(e.key, index)}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-[80%]">
        <button
          className={`p-3 rounded-lg text-white transition-all duration-200 flex items-center justify-center ${verifyingOtp ? "bg-gray-600/50" : "bg-pink-400 hover:bg-indigo-600"}`}
          onClick={() => {
            verifyOtp(emailCode.join(""));
          }}
        >
          {verifyingOtp ? <Loader2 className="animate-spin text-gray-200"/> : "Verify"}
        </button>
        <div className="flex items-center justify-center">
            <h1>Didn't Receive OTP? <span className="text-blue-400 cursor-pointer" onClick={()=>{console.log("Resend OTP:"); toast.promise(sendOtp(localStorage.getItem("reset") ? localStorage.getItem("reset-email") :(localStorage.getItem("email")), localStorage.getItem("reset") == true), {loading: "Sending...", success: "OTP has been sent", error: "Error While Sending OTP"})}}>Resend OTP</span></h1>
        </div>
      </div>
    </div>
  );
}
