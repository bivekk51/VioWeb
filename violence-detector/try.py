import tkinter as tk
from tkinter import messagebox, scrolledtext
import cv2
import os
import threading
import time
import subprocess
import json

# Folder for saving recorded videos
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class VideoRecorder:
    def __init__(self, root):
        self.root = root
        self.root.title("Violence Detection Recorder")
        self.root.geometry("400x300")

        self.recording = False
        self.cap = None
        self.video_writer = None

        # UI Elements
        self.start_btn = tk.Button(root, text="Start Recording", command=self.start_recording)
        self.start_btn.pack(pady=10)

        self.stop_btn = tk.Button(root, text="Stop Recording", command=self.stop_recording, state=tk.DISABLED)
        self.stop_btn.pack(pady=10)

        self.output_text = scrolledtext.ScrolledText(root, wrap=tk.WORD, width=50, height=10)
        self.output_text.pack(pady=10)
        self.output_text.config(state=tk.DISABLED)

    def start_recording(self):
        """Starts video recording from the webcam."""
        self.recording = True
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)

        threading.Thread(target=self.record_video, daemon=True).start()

    def record_video(self):
        """Captures video from the webcam and saves it."""
        self.cap = cv2.VideoCapture(0)
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        filename = os.path.join(UPLOAD_FOLDER, f"recorded_{int(time.time())}.avi")
        self.video_writer = cv2.VideoWriter(filename, fourcc, 20.0, (640, 480))

        while self.recording:
            ret, frame = self.cap.read()
            if not ret:
                break
            self.video_writer.write(frame)
            cv2.imshow("Recording", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        self.cap.release()
        self.video_writer.release()
        cv2.destroyAllWindows()

        self.process_video(filename)

    def stop_recording(self):
        """Stops recording the video."""
        self.recording = False
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)

    def process_video(self, video_path):
        """Processes the recorded video using `video2.py`."""
        try:
            # Run video2.py and capture only JSON output
            result = subprocess.run(
                ['python', 'video2.py', video_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,  # Hide TensorFlow warnings
                text=True
            )

            raw_output = result.stdout.strip()
            json_data = None

            # Extract JSON output
            for line in raw_output.split("\n"):
                try:
                    parsed = json.loads(line)
                    if "highest_accuracy" in parsed and "average_accuracy" in parsed:
                        json_data = parsed  # Keep only the latest JSON
                except json.JSONDecodeError:
                    pass  # Ignore non-JSON lines

            if json_data:
                self.display_result(json_data)

        except Exception as e:
            print("Error processing video:", e)

    def display_result(self, data):
        """Displays the processed results in the UI."""
        self.output_text.config(state=tk.NORMAL)
        self.output_text.delete(1.0, tk.END)
        self.output_text.insert(tk.END, json.dumps(data, indent=4))
        self.output_text.config(state=tk.DISABLED)

        if data.get("average_accuracy", 0) > 0.5:
            messagebox.showwarning("Violence Alert", "Probable Violence Detected!")

if __name__ == "__main__":
    root = tk.Tk()
    app = VideoRecorder(root)
    root.mainloop()
