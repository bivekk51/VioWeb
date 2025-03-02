import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const sampleVideos = [
  { name: "Non Violence", url: "/src/assets/nonv.mp4" },
  { name: "Violence", url: "/src/assets/violence.mp4" },
];

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage]=useState("");

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setErrorMessage("");
      setResponseMessage("");
    } else {
      setErrorMessage("Please select a valid video file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "video/*",
    onDrop,
  });

  const uploadVideo = async () => {
    if (!selectedFile) {
      setErrorMessage("No video file selected.");
      return;
    }

    setLoading(true);
    setResponseMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await fetch("http://192.168.18.254:5000/videoupload", {
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
        setResponseMessage("🔴 Extreme violence detected. Clip forwarded to Telegram.");
      } else if (average_accuracy > 0.5) {
        setResponseMessage("🟠 Probable violence detected. Clip forwarded to Telegram.");
      } else {
        setResponseMessage("🟢 No violence detected. No action taken.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Failed to upload the video. Please try again.");
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const handleSampleClick = async (video) => {
    try {
      const response = await fetch(video.url);
      const blob = await response.blob();
      const file = new File([blob], video.name, { type: "video/mp4" });

      setSelectedFile(file);
      setErrorMessage("");
      setResponseMessage("");
    } catch (error) {
      console.error("Failed to load sample video:", error);
      setErrorMessage("Failed to load sample video.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 mb-20 p-8 bg-gradient-to-b from-gray-800 to-blue-900 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-100">Video Uploader</h2>

      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`w-full mb-6 p-6 border-2 border-dashed rounded-lg transition-all cursor-pointer flex flex-col items-center ${
          isDragActive ? "border-blue-500 bg-blue-800" : "border-blue-700 bg-blue-900 bg-opacity-50 hover:bg-blue-800 hover:border-blue-500"
        }`}
      >
        <input {...getInputProps()} />
        <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p className="mt-2 text-base text-blue-100">
          {selectedFile ? selectedFile.name : "Drag & Drop a video here or click to upload"}
        </p>
      </div>

      {errorMessage && (
        <div className="w-full bg-red-900 bg-opacity-70 p-4 rounded-lg mb-6 text-white font-medium">
          <p>{errorMessage}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mr-3"></div>
          <p className="text-blue-300 font-medium">Processing video...</p>
        </div>
      )}

      <button
        onClick={uploadVideo}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg ${
          !selectedFile || loading
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-1"
        }`}
        disabled={!selectedFile || loading}
      >
        Upload Video
      </button>

      {responseMessage && (
        <div className="mt-6 w-full">
          <div
            className={`px-6 py-4 rounded-lg text-center font-bold text-lg transition-all ${
              responseMessage.includes("Extreme")
                ? "bg-red-700 bg-opacity-70 text-white animate-pulse"
                : responseMessage.includes("Probable")
                ? "bg-orange-600 bg-opacity-70 text-white animate-pulse"
                : "bg-green-600 bg-opacity-70 text-white"
            }`}
          >
            {responseMessage}
          </div>
        </div>
      )}

      {/* Sample Videos for Testing */}
      <div className="mt-8 w-full">
        <h3 className="text-xl text-white font-semibold mb-4">Try with Sample Videos:</h3>
        <div className="flex space-x-4">
          {sampleVideos.map((video, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(video)}
              className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              {video.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
