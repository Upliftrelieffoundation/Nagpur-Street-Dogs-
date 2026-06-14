import React, { Suspense } from 'react'
import { Routes, Route } from "react-router-dom"
import ScrollToTop from './Components/ScrollToTop'
import Layout from './Layout/Layout'
import Home from './Pages/Home'
import About from './Pages/About'
import OurTeam from './Pages/OurTeam'
import VolunteerPage from './Pages/VolunteerPage'
import Founder from './Pages/Founder'
import Register from './Components/Register'
import Signin from './Components/Signin'
import Donate from './Pages/Donate'
import EditorPage from './Editor/EditorPage.jsx'
import CommunityHome from './Editor/CommunityHome.jsx'
import BlogId from './Editor/BlogId.jsx'
import AdoptDogsPage from './Components/AdoptDogsPage.jsx'
import AddDogForm from './Components/AdoptForm.jsx'
import DogDetailsPage from './Components/DogDetailsPage.jsx'
import UserProfile from './Pages/UserPage.jsx'
import Maps from './Pages/Maps.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/donate' element={<Donate />} />
        <Route path='/ourTeam' element={<OurTeam />} />
        <Route path='/volunteer' element={
          <ProtectedRoute>
            <VolunteerPage />
          </ProtectedRoute>
        } />
        <Route path='/founder' element={<Founder />} />
        <Route path='/register' element={<Register />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/community' element={<CommunityHome />} />
        <Route path='/blog/:id' element={<BlogId />} />
        <Route path="/:userId" element={<UserProfile/>}/>
        <Route path='/adopt' element={<AdoptDogsPage/>}/>
        <Route path='/adopt-form' element={
          <ProtectedRoute>
            <AddDogForm />
          </ProtectedRoute>
        }/>
        <Route path='/maps' element={<Maps/>}/>
      </Route>
      <Route path='/editor' element={
        <ProtectedRoute>
          <EditorPage />
        </ProtectedRoute>
      } />

      <Route path="/dog/:id" element={<DogDetailsPage />} />
    </Routes>
    </>
  );
}

export default App;
