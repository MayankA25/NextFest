import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import MainContent from "../MainContent/MainContent";
import { useEffect } from "react";

export default function MainPage() {
  useEffect(()=>{
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName")
  }, [])
  return (
    <div className="w-[100vw] h-[100vh] bg-[#111]">
      <div className="flex items-center w-full h-full relative">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
