import React from 'react'
import Header from '../Components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

function Layout({children}) {
  return (
    <>
    <div className='bg-gradient-to-br from-amber-200 via-amber-50 to-amber-200 min-h-screen w-full relative overflow-x-hidden overflow-y-auto'>
        <div className="blob-orb-1 -top-20 -left-20 opacity-40"></div>
        <div className="blob-orb-2 top-1/2 -right-20 opacity-30"></div>
        <Header/>
        <Outlet/>
        <Footer/>
    </div>
    </>
  )
}

export default Layout