import { Loader2, Pen, Save } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useState } from 'react';
import { useRef } from 'react';

export default function AccountInfo() {
    const { user } = useAuthStore();
    const [hover, setHover] = useState(false);
    const ref = useRef(null);
  return (
    <div className="flex flex-col items-center h-full gap-13">
        <div className="flex items-center justify-between w-full">
            <h1 className='text-4xl'>Personal Information</h1>
            <div className="flex items-center gap-5">
                <button className="btn bg-white text-black rounded-lg flex items-center gap-2 text-md"><span><Save className='size-5' /></span> Save</button>
                <button className="btn bg-white text-black rounded-lg flex items-center gap-2 text-md"><span><Pen className='size-5' /></span> Edit</button>
            </div>
        </div>
        <hr className='w-full text-white/15'/>
        <div className="flex items-center w-full gap-3">
            <div className='w-50 h-50 rounded-full bg-white/20 relative' onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>
                <img src={user?.profilePic} className='w-full h-full object-contain rounded-full' />
                <div className={`w-full h-full z-5 bg-black/30 backdrop-blur-md absolute top-0 ${hover ? "opacity-100" : "opacity-0"} transition-all duration-200 rounded-full flex items-center justify-center`} onClick={()=>ref.current.click()}>
                    <Pen className='text-white'/>
                </div>
                <input ref={ref} accept='image/*' type="file" className='hidden' />
            </div>
            {/* <div className="flex items-center gap-1">
                <Loader2 className='animate-spin'/>
                <h1>Updating</h1>
            </div> */}
        </div>
        <hr className='w-full text-white/15'/>
        <div className="grid grid-cols-2">
            
        </div>
    </div>
  )
}
