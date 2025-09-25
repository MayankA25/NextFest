import React from "react";
import { useFormStore } from "../../store/useFormStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProfilePicture() {
    const { profilePicture } = useFormStore();
    const { user } = useAuthStore();
  return (
    <img
      src={
        profilePicture.trim().length != 0
          ? profilePicture
          : user?.profilePic || "https://picsum.photos/id/237/200/300"
      }
      className="w-full h-full rounded-full object-contain bg-[#222]"
    />
  );
}
