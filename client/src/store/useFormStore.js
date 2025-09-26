import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { uploadFiles } from "../../utils/uploadFile";

export const useFormStore = create((set, get) => ({
  interestCount: 1,

  interests: [
    "-- Select Interest --",
    "Technology",
    "Music",
    "Arts & Culture",
    "Sports & Fitness",
    "Social & Community",
    "Fun & Miscellaneous",
  ],

  formDetails: {
    phoneNumber: '',
    regNo: ''
  },

  updating: false,

  selectedInterests: [""],

  profilePicture: "",

  setInterestCount: (newCount) => {
    set({ interestCount: newCount });
  },

  selectInterest: (index, val) => {
    if(index >= get().interests.length -2) return;
    if (val.trim().length == 0) return;
    console.log("Index: ", index);
    console.log("Value: ", val);
    const tempInterests = [...get().selectedInterests];
    const tempIntArray = [...get().interests];

    const foundIndex = tempInterests.findIndex((element, index) => {
      return element == val;
    });

    console.log("Found Index: ", foundIndex);

    if (foundIndex != -1) {
      return toast.error("Duplicate Interests");
    }
    tempInterests.splice(index, 1, val);
    get().setInterestCount(get().interestCount+1);
    console.log(tempInterests);
    set({ selectedInterests: tempInterests });
  },

  setFormDetails: async(obj)=>{
    set({ formDetails: { ...get().formDetails, ...obj } });
    console.log("Form Details: ", get().formDetails);
  },

  submitForm: async()=>{
    const { formDetails } = get();
    const user = useAuthStore.getState().user;
    if(formDetails.phoneNumber.trim().length == 0) return toast.error("Phone Number field is required");
    if(!user.isPublicDomain && formDetails.regNo.trim().length == 0) return toast.error("Reg No Field Is Required");
    try{
      const response = await axiosInstance.put("/auth/submitform", {
        id: user._id,
        phoneNumber: formDetails.phoneNumber,
        regNo: user.isPublicDomain ? undefined : formDetails.regNo,
        interests: get().selectedInterests,
        profilePicture: get().profilePicture || useAuthStore.getState().user.profilePic
      })
      console.log(response.data);
      const updatedUser = {...useAuthStore.getState().user, initialFormSubmitted: true};
      useAuthStore.getState().setUser(updatedUser);
      return toast.success("Form Submitted");
    }catch(e){
      console.log(e);
      return toast.error(e.response.data.msg);
    }
  },

  uploadProfilePicture: async(formData)=>{
    toast.promise(async ()=>{
      set({ updating: true });
      const urls = await uploadFiles(formData);
      set({ profilePicture: urls[0], updating: false });
    }, {
      loading: "Uploading...",
      success: "Profile Picture Updated",
      error:"Error While Updating Profile Picture"
    });
  },
}));
