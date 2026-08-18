import React from 'react'
import Header from '../Components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

function Layout({children}) {
  return (
    <>
    <div className='bg-nsd-beige-light min-h-screen w-full relative overflow-x-hidden overflow-y-auto'>
        <Header/>
        <Outlet/>
        <Footer/>
    </div>
    </>
  )
}

export default Layout