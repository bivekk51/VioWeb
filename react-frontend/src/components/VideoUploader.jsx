import React, { useState } from 'react';

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a valid video file.");
    }
  };

  const uploadVideo = async () => {
    if (!selectedFile) {
      setErrorMessage("No video file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Video uploaded successfully:", data);
      setAccuracy(data.highest_accuracy);
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Failed to upload the video. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Video Uploader</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <button
        onClick={uploadVideo}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900"
        disabled={!selectedFile}
      >
        Upload Video
      </button>
      {accuracy !== null && (
        <div className="mt-4">
          <h3>
            Accuracy: {accuracy > 0.5 ? "✅ High" : "❌ Low"} ({accuracy})
          </h3>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
