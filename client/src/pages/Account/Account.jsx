import { Link } from "lucide-react";
import React from "react";
import { useLinkStore } from "../../store/useLinkingStore";
import { useAuthStore } from "../../store/useAuthStore";
import Google from "../../../public/google_img.jpg"
import AccountInfo from "../../components/AccountInfo/AccountInfo";

export default function Account() {
  const { user } = useAuthStore();

  return (
    // <div className="flex flex-col w-[55%] m-auto py-10">
    //   <div className="flex items-center justify-between">
    //     <div className="flex items-center gap-4">
    //       <h1>Connect With Google</h1>
    //       <img src={Google} className="size-5" />
    //     </div>
    //    { user?.accountLinkedToGoogle ? <div className="flex items-center">
    //     <h1>Account Connected With: {user.googleDetails ? user.googleDetails.email : user.email}</h1>
    //    </div> : <div className="flex items-center gap-2 bg-white/15 hover:bg-white/30 transition-all duration-100 px-3 py-1.5 rounded-lg cursor-pointer" onClick={()=>linkGoogleAccount()}>
    //       <Link className="size-5" />
    //       <p>Connect</p>
    //     </div>}
    //   </div>
    // </div>
    <div className="w-[55%] m-auto py-10">
        <AccountInfo/>
    </div>
  );
}
