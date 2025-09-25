import { useEffect, useRef } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuthStore } from "./store/useAuthStore";
import Loader from "./components/Loader/Loader";
import Form from "./components/Form/Form";
import MainPage from "./pages/MainPage/MainPage";

gsap.registerPlugin(useGSAP);
function App() {
  const location = useLocation();
  const { getUser, authenticated } = useAuthStore();
  const ref = useRef();
  useEffect(()=>{
    // localStorage.clear();
    console.log("Checking User...");
    getUser();
    
  }, []);
  return (
    <section ref={ref} className={`bg-[#010426] before:content-[""] before:absolute before:top-2 before:left-2 before:w-[15vw] before:h-[15vw] before:bg-gradient-to-r before:from-purple-700 before:to-pink-500 before:rounded-full after:content-[""] after:absolute after:top-[70vh] after:right-10 after:w-[15vw] after:h-[15vw] after:bg-gradient-to-r after:from-purple-700 after:to-pink-500 after:rounded-full after:z-2 relative w-[100vw] min-h-[100vh] overflow-x-hidden ${location.pathname != "/" && "overflow-hidden"}`}>
      <Loader/>
      {(location.pathname == "/") && <Navbar />}
      {location.pathname == "/" && <div
        className="w-[15vw] h-[15vw] bg-gradient-to-r from-purple-700 to-pink-500 absolute top-[120vh] rounded-full z-2"
      ></div>}
      <div
        className="font-bold min-w-[100vw] min-h-[100vh] absolute top-0 text-white z-5"
        id="intro"
        style={{
          background: "transparent",
          backdropFilter: "blur(90px)",
        }}
      >
          <Routes>
            <Route exact path="/" element={<LandingPage/>}/>
            <Route exact path="/login" element={!authenticated || !localStorage.getItem("authenticated") ? <Login/> : <Navigate to={"/main"}/>} />
            <Route exact path="/signup" element={!authenticated || !localStorage.getItem("authenticated") ? <Login/> : <Navigate to={"/main"}/>} />
            <Route path="/main/*" element={authenticated || localStorage.getItem("authenticated") ? <MainPage/> : <Navigate to={"/"} />}></Route>
          {/* <LandingPage /> */}
          </Routes>
      </div>
      <Toaster/>
    </section>
  );
}

export default App;
