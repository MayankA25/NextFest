import { ChevronDown, ChevronRight, MoveRight } from "lucide-react";
import React from "react";
import Features from "../../components/Features/Features";

export default function LandingPage() {
  return (
    <div className="w-full h-full max-w-[90vw] min-h-[100vh] mx-auto p-50">
      <div className="flex flex-col items-center gap-13">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-900 p-2 rounded-lg px-3 text-center">
          Managment Software
        </div>
        <div className="flex flex-col items-center gap-4 text-7xl text-center">
          <h1 className="font-bold bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            One place for every club.
          </h1>
          <h1 className="font-bold bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            One click for every event.
          </h1>
        </div>
        <div className="text-xl text-center text-gray-400">
          <p>
            A smart way to manage clubs and campus events. From planning{" "}
            <br></br> to participation, everything in one platform.
          </p>
        </div>
        <button className="font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-xl cursor-pointer hover:scale-102 transition-all duration-100">
          Get Started <ChevronRight className="size-5" />
        </button>
        <div className="text-center text-lg text-gray-400">
            <p>The Events & Club Management System is a unified platform to simplify campus activities. It enables admins<br></br> to create and manage clubs while giving students easy access to events, registrations, and updates.<br></br> From workshops to fests, everything is organized in one place to boost participation<br></br> and strengthen the campus community.</p>
        </div>

        <div className="flex flex-col items-center text-lg gap-4 my-15">
            <p>Features</p>
            <a onClick={()=>document.getElementById("features").scrollIntoView()}><ChevronDown className="animate-bounce cursor-pointer hover:animate-none transition-all"/></a>
        </div>
        <section id="features">
        <Features/>
        </section>
      </div>
    </div>
  );
}
