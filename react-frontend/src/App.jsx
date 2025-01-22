import React from 'react'
import VideoRecorder from './components/VideoRecorder'
import VideoUploader from './components/VideoUploader'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Navbar from './components/NavBar'


const About = () => (
  <div className="flex flex-col items-center mt-8">
    <h2 className="text-3xl font-bold mb-4">About</h2>
    <p className="text-gray-700">
      This system helps to detect violent activities in videos and provides accuracy
      metrics. Ideal for security and monitoring systems.
    </p>
  </div>
);
const App = () => {
  return (
    <>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<VideoRecorder/>} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<VideoUploader />} />
      </Routes>
    </Router>
      
    </>
  )
}

export default App