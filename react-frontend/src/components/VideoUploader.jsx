import React, { useState } from "react";

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setErrorMessage("");
      setResponseMessage("");
    } else {
      setErrorMessage("Please select a valid video file.");
    }
  };

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
      const response = await fetch("http://192.168.1.78:5000/videoupload", {
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
        setResponseMessage("🔴 Extreme violence detected. Clip forwarded to telegram");
      } else if (average_accuracy > 0.5) {
        setResponseMessage("🟠 Probable violence detected. Clip forwarded to telegram");
      } else {
        setResponseMessage("🟢 No violence detected. No action taken.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Failed to upload the video. Please try again.");
    } finally {
      setLoading(false);
      setSelectedFile(null); // Clear the selected file
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 mb-20 p-8 bg-gradient-to-b from-gray-800 to-blue-900 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-100">Video Uploader</h2>
      
      <div className="w-full mb-6">
        <label className="flex flex-col items-center px-4 py-6 bg-blue-900 bg-opacity-50 text-blue-100 rounded-lg shadow-lg border-2 border-blue-700 border-dashed hover:bg-blue-800 hover:border-blue-500 transition-all cursor-pointer">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <span className="mt-2 text-base leading-normal">
            {selectedFile ? selectedFile.name : "Select a video to upload"}
          </span>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
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
    </div>
  );
};

export default VideoUploader;