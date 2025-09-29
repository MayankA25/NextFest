import {
  Calendar,
  CalendarSearch,
  ChevronUp,
  CircleCheck,
  LayoutDashboard,
  ListTodo,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../public/default_profile_2.jpg";

export default function Sidebar() {

  const navigate = useNavigate();

  const [hover, setHover] = useState(false);
  const containerRef = useRef(null);
  const opacityRef = useRef([]);
  const { logout } = useAuthStore();
  useEffect(() => {
    if (hover) {
      gsap.to(containerRef.current, {
        width: "20%",
        duration: 0.5,
      });

      gsap.to(opacityRef.current, {
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(containerRef.current, {
        width: "5%",
        duration: 0.5,
      });
      gsap.to(opacityRef.current, {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [hover]);


  const { user } = useAuthStore();

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${
        hover ? "w-[20%]" : "w-[5%] overflow-hidden"
      } p-3 px-5 border-r border-gray-500/20 h-full absolute z-20 `}
      onMouseOver={() => {
        console.log("Hovering");
        setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex flex-col relative h-full">
        <div
          className={`flex flex-col gap-20 absolute top-0 ${
            hover && "w-full"
          } transition-all`}
        >
          <span
            ref={(el) => opacityRef.current.push(el)}
            className={`text-4xl text-pink-600 text-center`}
          >
            NextFest
          </span>
          <div className="flex flex-col justify-center gap-8">
            <div
              className={`flex flex-col px-4 gap-3 py-6 border-b border-white/10 ${
                hover && "w-[100%]"
              }`}
            >
              <div className="flex items-center justify-start gap-3 text-xl hover:bg-white/20 rounded-lg p-2 transition-all duration-500 cursor-pointer" onClick={()=>navigate("/main/todos")}>
                <ListTodo />
                <h1
                  ref={(el) => opacityRef.current.push(el)}
                  className={`${hover ? "block" : "opacity-0"}`}
                >
                  ToDos
                </h1>
              </div>
              <div className="flex items-center justify-start gap-3 text-xl hover:bg-white/20 rounded-lg p-2 transition-all duration-500 cursor-pointer">
                <Calendar />
                <h1 className={`${hover ? "block" : "opacity-0"}`}>Calendar</h1>
              </div>
            </div>
            <div className="flex flex-col px-4 gap-3 py-6 border-b border-white/10">
              <div className="flex items-center justify-start gap-3 text-xl hover:bg-white/20 rounded-lg p-2 transition-all duration-500 cursor-pointer" onClick={()=>navigate("/main/")}>
                <LayoutDashboard />
                <h1
                  ref={(el) => opacityRef.current.push(el)}
                  className={`${hover ? "block" : "opacity-0"}`}
                >
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center justify-start gap-3 text-xl hover:bg-white/20 rounded-lg p-2 transition-all duration-500 cursor-pointer">
                <CalendarSearch />
                <h1
                  ref={(el) => opacityRef.current.push(el)}
                  className={`${hover ? "block" : "opacity-0"}`}
                >
                  Events
                </h1>
              </div>
              <div className="flex items-center justify-start gap-3 text-xl hover:bg-white/20 rounded-lg p-2 transition-all duration-500 cursor-pointer">
                <Users />
                <h1 className={`${hover ? "block" : "opacity-0"}`}>Clubs</h1>
              </div>
              <div className="flex items-center justify-start gap-3 text-xl hover:bg-white/20 rounded-lg p-2 transition-all duration-500 cursor-pointer">
                <CircleCheck className={``} />
                <h1
                  ref={(el) => opacityRef.current.push(el)}
                  className={`${hover ? "block" : "opacity-0"} w-full`}
                >
                  Registered
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between absolute bottom-0 py-2 w-full px-2">
          <div className="flex items-center gap-2 relative w-full p-6">
            <img
              src={user?.profilePic || DefaultProfile}
              alt=""
              className={`bg-white rounded-full object-contain w-10 h-10 absolute left-0 ${
                !hover && " left-0"
              }`}
            />
            <h1
              ref={(el) => opacityRef.current.push(el)}
              className={`text-xl ${
                !hover ? "opacity-0" : "block"
              } absolute right-0`}
            >
              {user?.firstName}
            </h1>
          </div>
          <div
            className={`${
              !hover ? "hidden" : "block"
            } p-2 rounded-md flex items-center gap-2.5 relative cursor-pointer`}
          >
            <div className="dropdown dropdown-top">
              <div tabIndex={0} role="button" className="hover:bg-white/10 p-1 rounded-md">
                <ChevronUp />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-[#222] rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li className="cursor-pointer">
                  <a onClick={()=>navigate("/main/account")}>Account</a>
                </li>
                <li className="cursor-pointer" onClick={()=>logout()}>
                  <a>LogOut</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
