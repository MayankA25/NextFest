import {
  ArrowLeft,
  Calendar,
  Link,
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  Pen,
  Phone,
  Save,
  SquarePen,
} from "lucide-react";
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import { useRef } from "react";
import DefaultProfile from "../../../public/default_profile_2.jpg";
import { useLinkStore } from "../../store/useLinkingStore";
import toast from "react-hot-toast";
import EditAccountInfo from "../EditAccountInfo/EditAccountInfo";
import { useAccountStoreInfo } from "../../store/useAccountInfoStore";

export default function AccountInfo() {
  const { user, uploadResume, deleteResume, uploadProfilePicture } =
    useAuthStore();
  const { setAccountDetails, setInterestCount } = useAccountStoreInfo();
  const { linkGoogleAccount } = useLinkStore();
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  const ref2 = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);
    uploadResume(formData);
  };

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    uploadProfilePicture(formData);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center hover:bg-white/15 cursor-pointer p-1.5 rounded-full transition-all duration-200">
            <ArrowLeft className="size-5" />
          </div>
          <h1 className="text-xl">Your Account</h1>
        </div>
        <EditAccountInfo/>
        <div className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 transition-all duration-200 cursor-pointer px-4 py-1.5 rounded-lg" 
        onMouseOver={()=>{setAccountDetails({ firstName: user?.firstName, lastName: user?.lastName, email: user?.email, phone: user?.phone, interests: [...user?.interests, ''] }); setInterestCount(user?.interests.length+1)}}
        onClick={()=>document.getElementById("my_edit_account_info_modal").showModal()}>
          <Pen className="size-4.5" />
          <h1>Edit</h1>
        </div>
      </div>
      <hr className="my-10 text-white/20" />
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div
              className="flex items-center justify-center relative"
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              onClick={() => {
                ref.current.click();
              }}
            >
              <div className="flex flex-col justify-center relative">
                <img
                  src={user?.profilePic || DefaultProfile}
                  className="w-30 h-30 rounded-full object-contain bg-[#222]"
                />
                {/* {<div className="flex items-center gap-1 absolute -bottom-10">
                <Loader2 className="animate-spin"/>
                <h1>Updating</h1>
                </div>} */}
              </div>
              {
                <div
                  className={`flex items-center justify-center absolute w-full h-full bg-white/10 rounded-full backdrop-blur-lg ${
                    !hover && "opacity-0"
                  } transition-all duration-200 cursor-pointer`}
                >
                  <Pen />
                </div>
              }
              <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileChange}
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-4xl">
                {user?.firstName} {user?.lastName}
              </h1>
              <h2 className="text-xl text-white/50">
                {user?.role[0].toUpperCase()}
                {user?.role.slice(1, user?.role.length)}
              </h2>
            </div>
          </div>
          {!user?.googleDetails && (
            <div
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 cursor-pointer px-4 py-2 rounded-lg"
              onClick={() => linkGoogleAccount()}
            >
              <Link />
              <h1>Link Account</h1>
            </div>
          )}
          {user?.googleDetails && (
            <div className="flex items-center">
              <h1>
                Connected With:{" "}
                <span className="ml-2">{user?.googleDetails.email}</span>
              </h1>
            </div>
          )}
        </div>
        {user?.interests && user?.interests[0]?.length != 0 && (
          <div className=" mt-4 py-1 flex items-center gap-5">
            <div className="grid grid-cols-5 gap-4 items-center">
              {user?.interests.map((interest, index) => {
                return (
                  <span key={index} className="flex items-center justify-center bg-[#333] hover:bg-[#444] cursor-default transition-all duration-200 px-4 py-1 text-sm rounded-full">
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <hr className="my-10 text-white/20" />
      <div className="flex flex-col justify-center gap-4">
        <div className="grid grid-cols-2 ">
          <h1 className="text-xl">Email </h1>
          <div className="flex items-center gap-3">
            <Mail className="size-5" />
            <h1>{user?.email}</h1>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <h1 className="text-xl">Phone </h1>
          <div className="flex items-center gap-3">
            <Phone className="size-5" />
            <h1>{user?.phone}</h1>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <h1 className="text-xl">Joined </h1>
          <div className="flex items-center gap-3">
            <Calendar className="size-5" />
            <h1>{new Date(user?.createdAt).toDateString()}</h1>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <h1 className="text-xl">Location </h1>
          <div className="flex items-center gap-3">
            <MapPin className="size-5" />
            <h1>{user?.state}, {user?.country}</h1>
          </div>
        </div>
      </div>
      <hr className="mt-10 text-white/20" />
      <div className="grid grid-cols-4">
        <div className="flex flex-col gap-4 justify-center border-r border-l p-4 border-white/20">
          <h1 className="text-center text-lg">Events Registered</h1>
          <h1 className="text-center text-5xl">0</h1>
        </div>
        <div className="flex flex-col gap-4 justify-center border-r border-l p-4 border-white/20">
          <h1 className="text-center text-lg">Clubs Joined</h1>
          <h1 className="text-center text-5xl">0</h1>
        </div>
        <div className="flex flex-col gap-4 justify-center border-r border-l p-4 border-white/20">
          <h1 className="text-center text-lg">Total Clubs</h1>
          <h1 className="text-center text-5xl">0</h1>
        </div>
        <div className="flex flex-col gap-4 justify-center border-r border-l p-4 border-white/20">
          <h1 className="text-center text-lg">Tasks Completed</h1>
          <h1 className="text-center text-5xl">0</h1>
        </div>
      </div>
      <hr className="mb-10 text-white/20" />
      <div className="flex items-center justify-between my-10">
        <h1 className="text-xl">Upload Resume</h1>
        <div className="flex items-center justify-center gap-3 font-bold">
          <input
            ref={ref2}
            type="file"
            className="hidden"
            onChange={handleResumeUpload}
          />
          <button
            onClick={() => ref2.current.click()}
            className="btn bg-[#333]"
          >
            {user?.resume?.length != 0 ? "Update" : "Upload Resume"}
          </button>
          {user?.resume?.length != 0 && (
            <button
              onClick={() => deleteResume()}
              className="btn btn-error text-white"
            >
              Delete
            </button>
          )}
          {user?.resume?.length != 0 && (
            <a href={user?.resume} target="_blank" className="btn bg-[#444]">
              {" "}
              Show Resume
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
