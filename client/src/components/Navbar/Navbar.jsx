import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, authenticated, logout } = useAuthStore();
  return (
    <div className="sticky top-0 p-6 z-10 bg-indigo-600/10 backdrop-blur-md w-full">
      <div className="flex items-center justify-between w-[60%] m-auto relative">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            NextFest
          </h1>
        </div>
       { <div className="flex w-full absolute left-0 justify-center gap-12">
          <div className="flex items-center justify-center font-bold text-xl hover:scale-102 transition-all duration-300 text-indigo-100 text-center cursor-pointer">
            <a onClick={()=>document.getElementById("intro").scrollIntoView()}>Intro</a>
          </div>
          <div className="flex items-center justify-center font-bold text-xl hover:scale-102 transition-all duration-300 text-indigo-100 cursor-pointer">
            <a onClick={()=>document.getElementById("features").scrollIntoView()}>Features</a>
          </div>
        </div>}
        <div className="flex items-center gap-4 font-bold z-20">
          {!authenticated && <Link to={"/login"} className="flex items-center justify-center bg-radial from-indigo-500 to-indigo-700 p-2.5 px-5 rounded-lg cursor-pointer">
            <div className="cursor-pointer">Login</div>
          </Link>}
          {!authenticated && <div className="flex items-center justify-center bg-radial from-pink-400 to-pink-600 cursor-pointer text-white p-2.5 px-5 rounded-lg">
            <button className="cursor-pointer">SignUp</button>
          </div>}
          { authenticated && <div className="flex items-center justify-center bg-radial from-indigo-500 to-indigo-700 cursor-pointer text-white p-2.5 px-5 rounded-lg hover:scale-102" onClick={()=>logout()}>
            <button className="cursor-pointer flex items-center gap-2">Logout <LogOut className="size-5" /></button>
          </div>}
        </div>
      </div>
    </div>
  );
}
