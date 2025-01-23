import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const videoConstraints = {
    facingMode: isBackCamera ? "environment" : "user",
  };

  const startRecording = () => {
    setRecording(true);
    setResponseMessage("");
    setErrorMessage("");
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });

    const chunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      sendVideo(videoBlob);
    };

    mediaRecorderRef.current.start();
    setTimeout(() => stopRecording(), 5000); // Automatically stop after 5 seconds
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const sendVideo = async (videoBlob) => {
    setLoading(true); // Show processing message
    const formData = new FormData();
    formData.append("video", videoBlob, "capture.webm");

    try {
      const response = await fetch("http://192.168.1.78:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Video uploaded successfully:", data);

      const { average_accuracy } = data;
      if (average_accuracy > 0.7) {
        setResponseMessage("🔴 Extreme violence detected.");
      } else if (average_accuracy > 0.5) {
        setResponseMessage("🟠 Probable violence detected.");
      } else {
        setResponseMessage("🟢 No violence detected.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Failed to upload the video. Please try again.");
    } finally {
      setLoading(false);
    }
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
          disabled={recording}
          className={`px-4 py-2 rounded ${
            recording ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {recording ? "Recording..." : "Start Recording"}
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
            className={
              responseMessage.includes("Extreme")
                ? "text-red-500"
                : responseMessage.includes("Probable")
                ? "text-orange-500"
                : "text-green-500"
            }
          >
            {responseMessage}
          </h3>
        </div>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default VideoRecorder;
