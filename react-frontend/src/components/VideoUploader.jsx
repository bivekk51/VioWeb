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
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Video Uploader</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {loading && <p className="text-blue-500 mb-4">Processing video...</p>}
      <button
        onClick={uploadVideo}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900"
        disabled={!selectedFile || loading}
      >
        Upload Video
      </button>
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
    </div>
  );
};

export default VideoUploader;
