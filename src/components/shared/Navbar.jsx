import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <>
   <div className='flex flex-row items-end w-screen h-15 text-4xl border-b-2  p-2 ' >
   <Link to='/' className='pl-5 font-bold'>CodeClash</Link>
   <div className='pl-4 text-2xl'>
    <Link to='/'>Home </Link>
    <Link to='battle'>Battle </Link>
    <Link to='leaderboard'>Leaderboard </Link>
   </div>
   </div>
     
    </>
  )
}

export default Navbar