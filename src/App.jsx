import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Top_Header from './component/Top_Header.jsx'
import Main_page from './page/Main_page.jsx'
import Header from './component/Header.jsx'
import Footer from './component/Footer.jsx'
import Catalog from './page/Catalog.jsx'
import Contact from './page/Contact.jsx'
import ScrollToTop from './component/ScrollToTop.jsx'
import About from './page/About.jsx'
import TermCondition from './page/TermCondition.jsx'
import Privay from './page/Privay.jsx'
import Refund from './page/Refund.jsx'
import Shipping from './page/Shipping.jsx'
import Quality from './page/Qaulity.jsx'
import Third from './page/Third.jsx'
import Certificate from './page/Certificate.jsx'
import Manufacturing from './page/Manufacturing.jsx'
import Compliance from './page/Compliance.jsx'

const App = () => {
  return (
    <>
      <ScrollToTop/>
      <Top_Header />
      <Header/>
      <Routes>
        <Route path="/" element={<Main_page />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermCondition />} />
        <Route path="/privacy" element={<Privay />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/third" element={<Third />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/manufacturing" element={<Manufacturing />} />
        <Route path="/compliance" element={<Compliance />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App