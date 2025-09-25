import { create } from "zustand";

export const useLinkStore = create((set, get)=>({
    linkGoogleAccount: async()=>{
        window.location.href = "http://localhost:5000/api/auth/linkgoogle";
        
    }
}))