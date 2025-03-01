import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col items-center py-12 px-4 bg-gradient-to-b from-gray-800 to-blue-900 min-h-screen text-gray-100">
      <div className="max-w-4xl w-full bg-gray-900 bg-opacity-50 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Violence Detection System</h1>
        
        <p className="text-lg text-center mb-8">
          An AI-powered system designed to detect violent activities in video files using machine learning.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Overview</h2>
        <p className="mb-6">
          The Violence Detection System is an innovative solution that leverages AI and deep learning to identify violent activities in videos. 
          It is designed to enhance safety and security in various environments by enabling real-time monitoring and analysis of video feeds.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Use Cases</h2>
        <div className="mb-6 space-y-4">
          <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400">Schools & Educational Institutions</h3>
            <p>
              Schools can utilize this system to monitor hallways, classrooms, and playgrounds, ensuring student safety and preventing potential violence.
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400">Public Spaces & Secluded Streets</h3>
            <p>
              The system can be integrated with CCTV cameras in parks, streets, and public areas to detect violent activities and alert security personnel.
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400">Crowded Areas & Events</h3>
            <p>
              Large gatherings such as concerts, festivals, and stadiums can benefit from real-time video analysis to detect and prevent violent incidents.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-300">How It Works</h2>
        <p className="mb-6">
          The system operates by analyzing video frames and applying machine learning models to detect violent activities. 
          It provides accuracy metrics and alerts when a certain threshold is exceeded.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Key Features</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Real-time video analysis using AI</li>
          <li>Supports webcam recording and file uploads</li>
          <li>Displays accuracy metrics and confidence scores</li>
          <li>Integrates with security systems for instant alerts</li>
          <li>Minimalistic UI for easy usage</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3 text-blue-300">Conclusion</h2>
        <p className="mb-4">
          The Violence Detection System is a step towards enhancing security and safety through AI-driven surveillance. 
          By integrating this system, institutions and public spaces can proactively prevent violence and respond swiftly to incidents.
        </p>
      </div>
    </div>
  )
}

export default About