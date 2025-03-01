import React from 'react';

const TechnicalDetails = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 py-8 px-4">
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-xl shadow-xl text-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-300">Technical Details: Violence Detection System</h1>
        <p className="text-lg text-center mb-8 text-gray-200">
          A deep dive into how the system processes video, detects violence, and triggers alerts.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Frontend Implementation</h2>
            <p className="mb-4">
              The frontend is built using React and includes a video recording component (<span className="font-bold text-blue-300">VideoRecorder.jsx</span>).
              It captures a video stream and uploads it to the backend with a unique filename based on the current timestamp.
            </p>
            <p className="mb-4">
              Once uploaded, the frontend continuously pings the <span className="font-bold text-blue-300">/results/&lt;file_name&gt;</span> endpoint to check for processed results.
              This ensures real-time feedback and alerts once the video is analyzed.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">API Call Flow</h2>
            <p className="mb-3">
              <span className="font-bold text-blue-300">Video Upload:</span> The frontend sends a <span className="font-bold">POST</span> request to <span className="font-bold">/upload</span> with video data.
            </p>
            <p className="mb-3">
              <span className="font-bold text-blue-300">Polling for Results:</span> After uploading, it keeps calling <span className="font-bold">/results/&lt;file_name&gt;</span> every few seconds until the backend responds with a processed result.
            </p>
            <p className="mb-3">
              <span className="font-bold text-blue-300">Handling Response:</span> If the response contains <span className="font-bold">average_accuracy &gt; 0.5</span>, an alert is displayed, and a message is sent via Telegram, Email, or SMS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Backend Implementation</h2>
            <p className="mb-4">
              The backend is built using Flask and consists of two main files:
            </p>
            <ul className="space-y-2 pl-6 mb-4">
              <li><span className="font-bold text-blue-300">server.py:</span> Handles video uploads, invokes the processing script, and returns results.</li>
              <li><span className="font-bold text-blue-300">video.py:</span> Loads the AI model and processes video frames to detect violent activities.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Model Workflow</h2>
            <div className="space-y-2">
              <p>
                - The AI model processes the video frame by frame, checking for violent activities.
              </p>
              <p>
                - It assigns an accuracy score per frame and computes an average accuracy for the entire video.
              </p>
              <p>
                - If the <span className="font-bold">average_accuracy</span> exceeds <span className="font-bold">0.5</span>, an alert is triggered and a message is sent via the configured channel (Telegram, Email, or SMS).
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Alert Mechanism</h2>
            <p className="mb-4">
              If violence is detected with an average accuracy &gt; 0.5, an alert is sent to configured channels:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="p-2 bg-gray-800 bg-opacity-50 rounded-lg"><span className="font-bold text-blue-300">Telegram:</span> Sends a message to a configured bot.</li>
              <li className="p-2 bg-gray-800 bg-opacity-50 rounded-lg"><span className="font-bold text-blue-300">Email:</span> Can be configured to notify administrators.</li>
              <li className="p-2 bg-gray-800 bg-opacity-50 rounded-lg"><span className="font-bold text-blue-300">SMS:</span> Can integrate with Twilio or similar services.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetails;