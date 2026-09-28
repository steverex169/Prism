import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Top_Header from './component/Top_Header.jsx'
import Main_page from './page/Main_page.jsx'

const App = () => {
  return (
    <>
      <Top_Header />
      <Routes>
        <Route path="/" element={<Main_page />} />
      </Routes>
    </>
  )
}

export default App