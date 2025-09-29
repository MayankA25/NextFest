import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import './EditAccountInfo.css'
import { useAccountStoreInfo } from "../../store/useAccountInfoStore";
import { useAuthStore } from "../../store/useAuthStore";
import { X } from "lucide-react";

export default function EditAccountInfo() {
    const { accountDetails, interests, selectInterest, interestsCount, setAccountDetails, removeInterest,updateAccountProfile } = useAccountStoreInfo();

    const [phone, setPhone] = useState("")

    useEffect(()=>{
      setAccountDetails({ phone: phone });
    }, [phone])

  return (
    <dialog id="my_edit_account_info_modal" className="modal ">
      <div className="modal-box bg-[#222]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Edit Account</h3>
        <div className="flex flex-col justify-center py-5 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={accountDetails.firstName}
                onChange={(e)=>{setAccountDetails({ firstName: e.target.value })}}
                className="px-2 py-2 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500 w-full"
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={accountDetails.lastName}
                onChange={(e)=>{setAccountDetails({ lastName: e.target.value })}}
                className="px-2 py-2 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500 w-full"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="abc@gmail.com" value={accountDetails.email} readOnly className="px-2 py-2 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500 w-full" />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="email">Phone</label>
            <PhoneInput
              defaultCountry="IN"
              className="custom-input"
              placeholder="1234567890"
              value={accountDetails.phone}
              onChange={setPhone}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="interests" className="text-md">
              Your Interests
              <span className="mx-1 text-red-400">*</span>
              <br />
              <p className="text-sm text-gray-400">
                For recommendation of events
              </p>
            </label>

            {[...Array(interestsCount)].map((element, index) => {
              const interest = accountDetails.interests[index];
              return (
                <div key={index} className="flex items-center w-full gap-5">
                  <select
                    id="interests"
                    placeholder="Phone Number"
                    value={interest}
                    className="px-2 py-3 border border-purple-400 rounded-md focus:bg-gray-900 focus:outline-none focus:border-2 focus:border-indigo-500 w-full"
                    onChange={(e) => {selectInterest(index, e.target.value)}}
                  >
                    {interests.map((element2, index_2) => {
                      return (
                        <option
                          key={index_2}
                          value={index_2 == 0 ? "" : element2}
                        >
                          {element2}
                        </option>
                      );
                    })}
                  </select>
                  {index != accountDetails.interests.length-1 && <div className="flex items-center justify-center bg-white/10 hover:bg-white/15 transition-all duration-200 p-2 rounded-md" onClick={()=>removeInterest(index)}>
                    <X className="size-5"/>
                  </div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn bg-[#333] hover:bg-[#444] rounded-md" onClick={()=>updateAccountProfile()}>Update</button>
      </form>
    </div>

      </div>
    </dialog>
  );
}
