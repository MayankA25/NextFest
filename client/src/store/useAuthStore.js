import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { checkEmailValidity } from "../../utils/checkEmail.js";
import { uploadFiles } from "../../utils/uploadFile.js";

const BASE_URL = "http://localhost:5000/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  authenticated: false,
  count: 0,
  tempCount: 0,
  direction: 1,
  signupCredentials: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  didSendOtp: false,
  verifyingOtp: false,
  checkingUniqueEmail: false,
  creatingAccount: false,
  loggingIn: false,
  loginCredentials: {
    email: "",
    password: "",
  },
  gettingUser: true,

  // accessToken: null,
  login: () => {

    try {
      window.location.href = `${BASE_URL}/auth/login`;
    } catch (e) {
      console.log("Some Error Occured!", e);
    }
  },
  getUser: async () => {
      set({ gettingUser: true })
    try {
      console.log("Inside Getting User");
      const response = await axiosInstance.get("/auth/getuser");
      console.log(response.data);
      set({
        user: response.data.user,
        authenticated: response.data.authenticated,
      });
      // window.location.href="http://localhost:5173/main"
      toast.success("Logged In Successfully");
      localStorage.setItem("authenticated", true);
      // window.href.location = "http://localhost:5173/main";
      // window.location.href = "http://localhost:5173/main"
      // setTimeout(()=>{
      //   window.location.href = "http://localhost:5173/main";
      // }, 1000)
    } catch (e) {
      console.log(e);
      toast.error("Not Logged In");
      set({ user: null, authenticated: false });
      localStorage.removeItem("authenticated");
    }finally{
      set({ gettingUser: false });
    }
  },
 
  setAuthenticationManual: async (val) => {
    set(val);
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      console.log(response.data);
      set({ user: null, authenticated: false });
      localStorage.removeItem("authenticated")
      toast.success("Logged Out");
    } catch (e) {
      console.log(e);
    }
  },

  setCount: (val) => {
    set({ count: val });
  },

  setTempCount: (val, direction) => {
    set({ tempCount: val, direction: direction });
  },
  setSignupCredentials: async (updateObj) => {
    set({ signupCredentials: { ...get().signupCredentials, ...updateObj } });
  },

  setLoginCredentials: async (obj) => {
    console.log(obj);
    console.log("LC: ", get().loginCredentials);
    set({ loginCredentials: { ...get().loginCredentials, ...obj } });
  },
  sendOtp: async (recipientEmail, reset) => {
    console.log("Inside Sending OTP........")
    if (
      !localStorage.getItem("reset") &&
      get().signupCredentials.email.length == 0 &&
      !localStorage.getItem("email")
    ){ return;}


    try {
      
      const response = await axiosInstance.post(
        "/auth/sendotp",
        {
          recipientEmail: recipientEmail,
          reset: reset
        },
        { skipAuth: true }
      );

      console.log(response.data);
      set({ didSendOtp: true });
      localStorage.setItem("otp", "sent");
      // toast.success("Otp Has Been Sent!");
    } catch (e) {
      console.log(e);
      toast.error("Error While Sending OTP");
      set({ didSendOtp: false });
    }
  },

  verifyOtp: async (enteredOtp, reset) => {
    try {
      set({ verifyingOtp: true });
      const response = await axiosInstance.post(
        "/auth/verifyotp",
        {
          email: localStorage.getItem("reset") ? localStorage.getItem("reset-email") : get().signupCredentials.email || localStorage.getItem("email"),
          enteredOtp: Number.parseInt(enteredOtp),
          reset: reset
        },
        { skipAuth: true }
      );
      console.log(response);

      if (response.data.verified) {
        // localStorage.setItem("otpVerified", true);
        localStorage.removeItem("otp");
        set({ tempCount: get().count + 1 });
        localStorage.setItem("password", true);
        toast.success("Verified!");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.msg);
    } finally {
      set({ verifyingOtp: false });
    }
  },

  checkUniqueEmail: async () => {
    const { signupCredentials } = get();

    console.log("Credentials: ", signupCredentials);

    try {
      set({ checkingUniqueEmail: true });
      localStorage.setItem("firstName", get().signupCredentials.firstName);
      localStorage.setItem("lastName", get().signupCredentials.lastName);
      localStorage.setItem("email", get().signupCredentials.email);
      const response = await axiosInstance.post(
        "/auth/checkunique",
        {
          email: signupCredentials.email,
        },
        { skipAuth: true }
      );
      console.log("Checking Unique: ", response.data);
      set({ tempCount: get().count + 1 });
    } catch (e) {
      console.log(e);
      if (e.response.data.duplicate) {
        toast.error("Email Already Exists");
      }
    } finally {
      set({ checkingUniqueEmail: false });
    }
  },

  // ToDo:- Move credentials from local Storage to session Storage
  manualSignup: async () => {
    try {
      set({ creatingAccount: true });
      if (
        get().signupCredentials.password !==
        get().signupCredentials.confirmPassword
      ) {
        return toast.error("Password Did Not Match!");
      }
      const response = await axiosInstance.post(
        "/auth/signup",
        {
          firstName:
            get().signupCredentials.firstName ||
            localStorage.getItem("firstName"),
          lastName:
            get().signupCredentials.lastName ||
            localStorage.getItem("lastName"),
          email: get().signupCredentials.email || localStorage.getItem("email"),
          password: get().signupCredentials.password,
        },
        { skipAuth: true }
      );
      console.log(response.data);
      set({ authenticated: true, user: response.data.user });
      toast.success("Account Created!");
      localStorage.setItem("authenticated", true);
    } catch (e) {
      console.log(e);
      set({ authenticated: false });
      toast.error("Error While Creating Account!");
      localStorage.removeItem("authenticated");
    } finally {
      set({ creatingAccount: false });
    }
  },

  manualLogin: async () => {
    const { loginCredentials } = get();
    try {
      set({ loggingIn: true });
      const response = await axiosInstance.post(
        "/auth/login",
        { email: loginCredentials.email, password: loginCredentials.password },
        { skipAuth: true }
      );
      console.log(response.data);
      set({ authenticated: true, user:response.data.user });
      toast.success("Logged In Successfully");
      localStorage.setItem("authenticated", true);
    } catch (e) {
      console.log(e);
      set({ authenticated: false, user: null });
      toast.error("Invalid Email or Password");
      localStorage.removeItem("authenticated");
    } finally {
      set({ loggingIn: false });
    }
  },

  forgotPassword: async()=>{
    if(!checkEmailValidity(get().loginCredentials.email)){
      return toast.error("Enter Valid Email!");
    }
    try{

      const response = await axiosInstance.post(
        "/auth/checkunique",
        {
          email: get().loginCredentials.email,
        },
        { skipAuth: true }
      );

      if(!response.data.duplicate) return toast.error("User Does Not Exists");

      
    }
    catch(e){
      console.log(e);
      if(e.response.status == 400){
        localStorage.setItem("reset-email", get().loginCredentials.email);
        localStorage.setItem("reset", true);
        set({ tempCount: get().count+1 })
      }else{
        return toast.error("Internal Server Error");
      }
    }
  },

  resetPassword: async()=>{
    if(get().signupCredentials.password != get().signupCredentials.confirmPassword) return toast.error("Passwords did not match");
    try{
      const response = await axiosInstance.post("/auth/resetpassword", {
        email: localStorage.getItem("reset-email"),
        newPassword: get().signupCredentials.password
      }, { skipAuth: true });
      console.log(response.data);
      localStorage.removeItem("password");
      localStorage.removeItem("reset");
      localStorage.removeItem("reset-email")
      window.location.href = "/login";
      toast.success("Password Updated!")
    }catch(e){
      console.log(e);
    }
  },

  setUser: async(userObj)=>{
    set({ user: userObj });
  },

  uploadResume: async(formData)=>{
    try{
      // const response;
      const urls = await uploadFiles(formData);
      console.log("URLs: ", urls);
      set({ user: { ...get().user, resume: urls[0] } });
      const response = await axiosInstance.post("/auth/uploadresume", {
        id: get().user._id,
        resumeUrl: urls[0]
      });
      console.log(response.data);
    }catch(e){
      console.log(e);
    }
  },

  deleteResume: async()=>{
    try{
      set({ user: { ...get().user, resume: "" } });
      const response = await axiosInstance.post("/auth/uploadresume", {
        id: get().user._id,
        resumeUrl:""
      });
      console.log(response.data);
      toast.success("Deleted Resume");
    }catch(e){
      console.log(e);
    }
  }
}));
