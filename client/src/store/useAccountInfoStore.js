import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useAccountStoreInfo = create((set, get) => ({
  accountDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interests: [''],
  },

  interestsCount: 1,

  interests: [
    "-- Select Interest --",
    "Technology",
    "Music",
    "Arts & Culture",
    "Sports & Fitness",
    "Social & Community",
    "Fun & Miscellaneous",
  ],

  setAccountDetails: async (obj) => {
    console.log("Account Details: ", obj);
    set({ accountDetails: {...get().accountDetails, ...obj} });
  },

  setInterestCount: async(val)=>{
    console.log("Interest Count: ", val);
    set({ interestsCount: val })
  },

  selectInterest: async(index, val)=>{
    const tempInterests = [...get().accountDetails.interests];

    if(tempInterests.includes(val)){
        return toast.error("Duplicate Values")
    }

    tempInterests.splice(index, 1, val);
    console.log("Val: ", val);
    console.log("Temp Interests: ", tempInterests);
    let newCount = get().interestsCount;
    if(index < get().interests.length-1){
        tempInterests.push('');
        newCount+=1;
    }
    set({ accountDetails: { ...get().accountDetails, interests: [...tempInterests] }, interestsCount: newCount });
  },

  removeInterest: async(index)=>{
    const tempInterests = [...get().accountDetails.interests];
    tempInterests.splice(index, 1);
    console.log("Temp Interests: ", tempInterests);
    set({ accountDetails: { ...get().accountDetails, interests: tempInterests }, interestsCount: get().interestsCount-1 })
  },

  updateAccountProfile: async()=>{
    const { user, setUser } = useAuthStore.getState();
    try{

      
      const tempInterests = [...get().accountDetails.interests];
      
      const filteredInterests = tempInterests.filter((interest, index)=>{
        return interest.trim() != '';
      })
      setUser({ ...user, ...get().accountDetails, interests: filteredInterests });
      

      const response = await axiosInstance.put("/auth/updateaccount", {
        id: user._id,
        firstName: get().accountDetails.firstName,
        lastName: get().accountDetails.lastName,
        phone: get().accountDetails.phone,
        interests: filteredInterests
      });
      console.log(response.data);
      toast.success("Account Information Updated");
    }catch(e){
      console.log(e)
    }
  }
}));
