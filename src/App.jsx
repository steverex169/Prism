import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Top_Header from './component/Top_Header.jsx'
import Main_page from './page/Main_page.jsx'
import Header from './component/Header.jsx'
import Footer from './component/Footer.jsx'
import Catalog from './page/Catalog.jsx'
import Contact from './page/Contact.jsx'

const App = () => {
  return (
    <>
      <Top_Header />
      <Header/>
      <Routes>
        <Route path="/" element={<Main_page />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App