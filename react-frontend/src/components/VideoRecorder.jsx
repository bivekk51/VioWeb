import React,{useState,useRef} from 'react'
import axios from 'axios'
import Webcam from 'react-webcam';
const VideoRecorder = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [isBackCamera, setIsBackCamera] = useState(false);
    const [accuracy, setAccuracy] = useState(null);
  
    const videoConstraints = {
      facingMode: isBackCamera ? "environment" : "user", 
    };
  
    const startRecording = () => {
      setRecording(true);
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
      setTimeout(() => stopRecording(), 5000); 
    };
  
    const stopRecording = () => {
      setRecording(false);
      mediaRecorderRef.current.stop();
    };
  
    const sendVideo = async (videoBlob) => {
      const formData = new FormData();
      formData.append("video", videoBlob, "capture.webm");
    
      try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
          headers: {
            // No need to manually set Content-Type for FormData; the browser handles it.
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Video uploaded successfully:", data);
        setAccuracy(data.average_accuracy);
      } catch (err) {
        console.log("Something went wrong", err);
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
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
        {accuracy !== null && (
            <div className="mt-4">
                <h3>Accuracy: {accuracy > 0.5 ? "✅ High" : "❌ Low"} ({accuracy})</h3>
            </div>
        )}

      </div>

    );
}

export default VideoRecorder
