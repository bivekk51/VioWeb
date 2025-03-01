import React from 'react'
import VideoRecorder from './components/VideoRecorder'
import VideoUploader from './components/VideoUploader'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/NavBar'
import Home from './components/Home'
import Footer from './components/Footer'
import TechnicalDetails from './components/TechnicalDetails'
import About from './components/About'

const App = () => {
  return (
    <Router>
      {/* Full height container to ensure footer sticks to bottom */}
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Main content takes the remaining space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/videorecorder" element={<VideoRecorder />} />
            <Route path="/about" element={<About />} />
            <Route path="/videouploader" element={<VideoUploader />} />
            <Route path="/technicaldetails" element={<TechnicalDetails />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App;
