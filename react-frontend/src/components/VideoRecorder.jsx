import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [violenceAlerts, setViolenceAlerts] = useState([]); // Store violent timestamps

  const videoConstraints = {
    facingMode: isBackCamera ? "environment" : "user",
  };

  const startRecording = () => {
    if (isRecording) return;
    setIsRecording(true);
    setResponseMessage("");
    setErrorMessage("");

    recordingIntervalRef.current = setInterval(() => {
      captureAndSendVideo();
    }, 5000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordingIntervalRef.current);
  };

  const captureAndSendVideo = () => {
    if (!webcamRef.current || !webcamRef.current.stream) return;

    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      await sendVideo(videoBlob);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000);
  };

  const sendVideo = async (videoBlob) => {
    setLoading(true);
    const formData = new FormData();
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_"); // Unique filename
    const filename = `capture_${timestamp}.webm`;

    formData.append("video", videoBlob, filename);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Video uploaded successfully:", filename);
      pollForResults(filename);
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Failed to upload the video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const pollForResults = (filename) => {
    setLoading(true);

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/result/${filename}`)

        if (!response.ok) throw new Error("No results yet");

        const data = await response.json();
        console.log("Received results:", data);

        const { average_accuracy } = data;
        if (average_accuracy > 0.7) {
          setResponseMessage("🔴 Extreme violence detected.");
          setViolenceAlerts((prev) => [...prev, `Extreme violence detected at ${filename.replace("capture_", "").replace(".webm", "").replace(/_/g, ":")}`]);
        } else if (average_accuracy > 0.5) {
          setResponseMessage("🟠 Probable violence detected.");
          setViolenceAlerts((prev) => [...prev, `Probable violence detected at ${filename.replace("capture_", "").replace(".webm", "").replace(/_/g, ":")}`]);
        } else {
          setResponseMessage("🟢 No violence detected.");
        }

        clearInterval(interval);
        setLoading(false);
      } catch (error) {
        console.log("Waiting for processing...");
      }
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center  p-6 bg-gradient-to-b from-gray-800 to-blue-900  shadow-2xl">
      <div className="relative w-full max-w-md border-4 border-blue-400 rounded-xl overflow-hidden shadow-lg">
        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={videoConstraints}
          mirrored={!isBackCamera}
          className="w-full max-w-md"
        />
      </div>
      
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg ${
            isRecording 
              ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-1"
          }`}
        >
          {isRecording ? "Recording..." : "Start Continuous Recording"}
        </button>
        
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg ${
            !isRecording
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 transform hover:-translate-y-1"
          }`}
        >
          Stop Recording
        </button>
        
        <button
          onClick={() => setIsBackCamera((prev) => !prev)}
          className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:from-gray-700 hover:to-gray-900 transform hover:-translate-y-1"
        >
          Switch to {isBackCamera ? "Front" : "Back"} Camera
        </button>
      </div>
      
      {loading && (
        <div className="mt-6 flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400 mr-3"></div>
          <p className="text-blue-300 font-medium">Processing video...</p>
        </div>
      )}
      
      {responseMessage && (
        <div className="mt-6 w-full max-w-md">
          <h3
            className={`text-xl font-bold px-4 py-2 rounded-lg text-center transition-all ${
              responseMessage.includes("Extreme")
                ? "bg-red-700 bg-opacity-70 text-white animate-pulse"
                : responseMessage.includes("Probable")
                ? "bg-orange-600 bg-opacity-70 text-white animate-pulse"
                : "bg-green-600 bg-opacity-70 text-white"
            }`}
          >
            {responseMessage}
          </h3>
        </div>
      )}
      
      {errorMessage && (
        <div className="mt-6 w-full max-w-md bg-red-900 bg-opacity-70 p-4 rounded-lg">
          <p className="text-white font-medium">{errorMessage}</p>
        </div>
      )}
      
      {/* Enhanced Violence alert with dramatic animation */}
      {violenceAlerts.length > 0 && (
        <div className="mt-8 w-full max-w-lg bg-black bg-opacity-80 text-white p-6 rounded-lg shadow-2xl border-2 border-red-500 animate-bounce">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-red-500 mr-2 animate-ping" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-2xl font-bold text-red-500 animate-pulse">
              VIOLENCE DETECTED
            </h3>
            <svg className="w-8 h-8 text-red-500 ml-2 animate-ping" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="w-full h-1 bg-red-500 mb-4 animate-pulse"></div>
          <ul className="space-y-3">
            {violenceAlerts.map((alert, index) => (
              <li key={index} className="bg-red-800 p-3 rounded-lg flex items-center shadow-inner">
                <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-ping mr-2"></span>
                <span className="font-medium">{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
