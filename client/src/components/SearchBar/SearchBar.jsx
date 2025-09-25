import React from 'react'
import { useTodoStore } from '../../store/useTodoStore'

export default function SearchBar() {
  const { searchTodos } = useTodoStore();
  return (
    <div className='flex w-full sticky top-0 z-10 bg-[#111] py-7 rounded-lg'>
        <input type="text" className='input w-full bg-[#333] focus:outline-0 focus:outline-gray-400' placeholder='Search Your Todos' onChange={(e)=>searchTodos(e.target.value)} />
    </div>
  )
}
