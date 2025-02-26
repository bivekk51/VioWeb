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
      const response = await fetch("http://192.168.1.78:5000/upload", {
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
        const response = await fetch(`http://192.168.1.78:5000/result/${filename}`)

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
    }, 10000);
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        mirrored={!isBackCamera}
        className="w-full max-w-md"
      />
      <div className="mt-4 flex gap-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-4 py-2 rounded ${
            isRecording ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {isRecording ? "Recording..." : "Start Continuous Recording"}
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
        <button
          onClick={() => setIsBackCamera((prev) => !prev)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Switch to {isBackCamera ? "Front" : "Back"} Camera
        </button>
      </div>
      {loading && <p className="text-blue-500 mt-4">Processing video...</p>}
      {responseMessage && (
        <div className="mt-4">
          <h3
            className={`text-lg font-bold transition-opacity ${
              responseMessage.includes("Extreme")
                ? "text-red-500 animate-pulse"
                : responseMessage.includes("Probable")
                ? "text-orange-500 animate-pulse"
                : "text-green-500"
            }`}
          >
            {responseMessage}
          </h3>
        </div>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      {/* Violence alert dekhauney animation for now */}
      {violenceAlerts.length > 0 && (
        <div className="mt-6 w-full max-w-md bg-black text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2 text-red-400 animate-ping">
            ⚠️ Violence Detected
          </h3>
          <ul className="space-y-2">
            {violenceAlerts.map((alert, index) => (
              <li key={index} className="bg-red-600 p-2 rounded-lg animate-pulse">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
