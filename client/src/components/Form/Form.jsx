import { Loader, Loader2, Pen, Plus } from "lucide-react";
import React, { useRef } from "react";
import { useFormStore } from "../../store/useFormStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Suspense } from "react";
import { lazy } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const lazyComponent = lazy(() => import("../ProfilePicture/ProfilePicture"));

export default function Form() {
  const {
    interestCount,
    interests,
    selectInterest,
    setFormDetails,
    submitForm,
    uploadProfilePicture,
    updating,
  } = useFormStore();
  const { formDetails } = useFormStore();
  const { user } = useAuthStore();

  const fileInputRef = useRef(null);

  const handleProfilePicUpload = async (e) => {
    const profilePic = e.target.files[0];

    if (!profilePic) return;

    const formData = new FormData();
    formData.append("files", profilePic);

    uploadProfilePicture(formData);
    // toast.promise(async ()=>{
    // })
  };

  return (
    <div className="w-[50%] m-auto h-[100vh]">
      <div className="flex flex-col justify-center h-full w-full gap-10">
        <div className="flex items-center">
          <h1 className="text-5xl">Basic Details</h1>
        </div>
        <div className="flex flex-col justiy-center gap-5">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl">Profile Picture: </h1>
            <div className="flex items-center relative w-40 h-40">
              {updating ? (
                <Loader2 className="size-5 rounded-full object-contain bg-[#222] animate-spin" />
              ) : (
                <ProfilePicture />
              )}
              {!updating && (
                <div
                  className="bg-white/20 w-full h-full absolute top-[0%] rounded-full flex items-center justify-center transition-all duration-200 not-hover:opacity-0 cursor-pointer backdrop-blur-md"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Pen className="size-6 " />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleProfilePicUpload}
              />
            </div>
          </div>
          <div className="flex items-center w-full gap-10">
            <div className="flex flex-col justify-center gap-3 w-full">
              <label htmlFor="firstName" className="text-xl">
                First Name
                <span className="mx-1 text-red-400">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={user?.firstName || ""}
                readOnly
                placeholder="Enter First Name"
                className="p-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 w-full">
              <label htmlFor="lastName" className="text-xl">
                Last Name
                <span className="mx-1 text-red-400">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={user?.lastName || ""}
                readOnly
                placeholder="Enter Last Name"
                className="p-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500"
              />
            </div>
          </div>
          {!user?.isPublicDomain && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-center">
                <label htmlFor="role" className="text-xl">
                  Registeration Number
                  <span className="mx-1 text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-sm">Given by Institution</p>
              </div>
              <input
                id="regNo"
                value={formDetails?.regNo || ""}
                onChange={(e) => setFormDetails({ regNo: e.target.value })}
                type="text"
                placeholder="Emter Registration Number"
                className="p-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500"
              />
            </div>
          )}
          {!user?.isPublicDomain && (
            <div className="flex flex-col gap-3">
              <label htmlFor="role" className="text-xl">
                Role
                <span className="mx-1 text-red-400">*</span>
              </label>
              <input
                id="role"
                type="text"
                readOnly
                value={"Student"}
                placeholder="Role"
                className="p-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500"
              />
            </div>
          )}
          <div className="flex flex-col gap-3">
            <label htmlFor="phone" className="text-xl">
              Phone Number
              <span className="mx-1 text-red-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formDetails.phoneNumber || ""}
              onChange={(e) => setFormDetails({ phoneNumber: e.target.value })}
              placeholder="Phone Number"
              className="p-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="interest" className="text-xl">
              Your Interests
              <span className="mx-1 text-red-400">*</span>
              <br />
              <p className="text-sm text-gray-400">
                For recommendation of events
              </p>
            </label>

            {[...Array(interestCount)].map((element, index) => {
              return (
                <div key={index} className="flex items-center w-full gap-5">
                  <select
                    id="interest"
                    placeholder="Phone Number"
                    className="px-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500 w-full"
                    onChange={(e) => selectInterest(index, e.target.value)}
                  >
                    {interests.map((element, index_2) => {
                      return (
                        <option
                          key={index_2}
                          value={index_2 == 0 ? "" : element}
                        >
                          {element}
                        </option>
                      );
                    })}
                  </select>
                  {/* {index == interestCount-1 && <button className="flex items-center justify-center px-3.5 py-2.5 bg-white/10 rounded-lg gap-1 cursor-pointer" onClick={()=>{setInterestCount(interestCount+1)}}>
                    <Plus className="size-5" />
                    <h1>Add</h1>
                  </button>} */}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between my-3">
            <button
              className="font-bold bg-pink-500 p-2 px-5 rounded-lg cursor-pointer hover:bg-indigo-600 hover:scale-103 transiiton-all duration-300"
              onClick={() => submitForm()}
            >
              Save
            </button>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
