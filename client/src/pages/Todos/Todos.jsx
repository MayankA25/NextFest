import React from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import TodoContainer from '../../components/TodoContainer/TodoContainer'

export default function Todos() {
  return (
    <div className='w-[55%] m-auto py-3 flex flex-col gap-30'>
      <SearchBar/>
      <TodoContainer/>
    </div>
  )
}
