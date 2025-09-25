import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Credentials from "../../components/Credentials/Credentials";
import EmailVerification from "../../components/EmailVerification/EmailVerification";
import PasswordConfirmation from "../../components/PasswordConfirmation/PasswordConfirmation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Login() {
  const location = useLocation();
  // const [count, setCount] = useState(0);
  const { count, setCount, tempCount, setTempCount, direction } = useAuthStore();
  const currentContainerRef = useRef(null);
  // const [checkPoints, setCheckPoints] = useState()

  const transitionPages = (val, direction) => {
    gsap.to(currentContainerRef.current, {
      // x: 100*direction,
      opacity: 0,
      duration: 0.5,
    });
    // gsap.to(currentContainerRef.current, {
    //   x: -100*direction,
    //   opacity: 0,
    //   delay: 0.25
    // })
    setTimeout(() => {
      setCount(val);
    }, 500);
    gsap.to(currentContainerRef.current, {
      // x: 0,
      opacity: 1,
      duraion: 0.5,
      delay: 0.5,
    });
  };


  // useEffect(()=>{
  //   return () => {
  //     localStorage.removeItem("firstName");
  //     localStorage.removeItem("lastName");
  //     localStorage.removeItem("email");
  //   };
  // }, [])

  useEffect(() => {
    // console.log("Count Changed");

    if(localStorage.getItem("otp") == "sent"){
      transitionPages(1, -1);
      setTempCount(1);
      return;
    }

    if(localStorage.getItem("password")){
      transitionPages(2, -1);
      setTempCount(2);
      return;
    }

    // if (location.pathname == "/login" && localStorage.getItem("reset")) {
    //   transitionPages(tempCount, -1);
    //   // setTempCount(tempCount);
    // } else {
      transitionPages(tempCount, direction);
      console.log("Temp COunt: ", tempCount);
    // }

    
    
  }, [tempCount]);

  // useEffect(()=>{
  //   return ()=>{
  //     console.log("This Is running...")
  //     localStorage.removeItem("email");
  //     localStorage.removeItem("firstName");
  //     localStorage.removeItem("lastName");
  //     localStorage.removeItem("password");
  //   }
  // }, [])

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="w-[85%] h-[80%] bg-white flex items-center p-8 rounded-3xl flex-row-reverse">
        <div className="flex items-center w-[50%] h-full rounded-4xl relative z-5 ">
          <div className="bg-[url(./login_bg_2.jpeg)] w-full h-full object-contain absolute top-0 -z-2 rounded-4xl before:bg-black/10 before:backdrop-blur-sm before:w-full before:h-full before:absolute before:top-0 before:rounded-4xl"></div>
          <div className="flex flex-col justify-center items-center w-full">
            <h1 className="text-5xl text-center font-normal">
              FUTURE OF<br></br> <span className="font-bold">EVENTS</span>
              <br></br> MANAGEMENT
            </h1>
          </div>
        </div>
        <div className="flex flex-col justify-center w-[50%] h-full text-black gap-10 px-5 relative">
          {location.pathname == "/signup" && (
            <div className="absolute top-0 flex items-center justify-between w-[80%] m-auto">
              <div
                className={`flex items-center gap-2 ${
                  count == 0 ? "text-gray-500" : "cursor-pointer"
                }`}
                onClick={() => {
                  count != 0 && setTempCount(0, -1);
                  count != 0 && sessionStorage.removeItem("otp");
                  count == 2 && sessionStorage.removeItem("password");
                }}
              >
                <ChevronLeft />
                <h1>Back</h1>
              </div>
              {/* <div
              className={`flex items-center gap-2 ${
                count == 2 ? "text-gray-500" : "cursor-pointer"
              }`}
              onClick={() => count != 2 && setTempCount(count+1, 1)}
            >
              <h1>Next</h1>
              <ChevronRight />
            </div> */}
            </div>
          )}
          <div ref={currentContainerRef} className="w-full">
            {count == 0 && <Credentials />}
            {count == 1 && <EmailVerification />}
            {count == 2 && <PasswordConfirmation />}
          </div>
        </div>
      </div>
    </div>
  );
}
