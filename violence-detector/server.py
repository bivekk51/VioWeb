import os
import time
import subprocess
import json
import logging
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from telegram import Bot
import asyncio
# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "./uploads"
DIRECT_UPLOAD="./directupload"
RESULTS_FILE = "results.json"
TELEGRAM_BOT_TOKEN = "7942578600:AAGvoDCo517xEvMWJ5xeuzqDAD3hLDYftsg"
TELEGRAM_CHAT_ID = "5110056847"  


os.makedirs(UPLOAD_FOLDER, exist_ok=True)  


async def send_telegram_alert(video_path,report):
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if report.get("average_accuracy", 0) > 0.7: 
        caption = f"Extreme Violence detected, Time: {current_time} Clip: \n"
    elif report.get("average_accuracy", 0) > 0.5:
        caption=  f"Probable Violence detected, Time: {current_time} Clip:\n"
    
    try:
        with open(video_path, "rb") as video:
            await bot.send_video(chat_id=TELEGRAM_CHAT_ID, video=video, caption=caption)
        print("Video sent successfully!")
    except FileNotFoundError:
        print("Video file not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
def load_results():
    if os.path.exists(RESULTS_FILE):
        try:
            with open(RESULTS_FILE, "r") as file:
                return json.load(file)
        except json.JSONDecodeError:
            logging.error("Error decoding results.json, starting fresh.")
            return {}
    return {}

# Save results to file
def save_results(results):
    with open(RESULTS_FILE, "w") as file:
        json.dump(results, file, indent=2)

video_results = load_results()  # Load initial results

def process_video(video_path):
    """Processes the video and extracts accuracy details."""
    try:
        result = subprocess.run(
            ['python', 'video.py', video_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,  
            text=True
        )

        raw_output = result.stdout.strip()
        logging.info(f"Raw output from video.py: {raw_output}")

        json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
        if json_match:
            report = json.loads(json_match.group(0))
            if report.get("average_accuracy", 0) > 0.5:
                asyncio.run(send_telegram_alert(video_path,report))
            filename = os.path.basename(video_path)
            video_results[filename] = report  # Store result
            save_results(video_results)  # Persist results
            return report
        else:
            logging.error("Failed to parse JSON output")
            return None
    except json.JSONDecodeError as e:
        logging.error("JSON decode error: %s", str(e))
        return None
    except Exception as e:
        logging.error("Unexpected error: %s", str(e))
        return None

def monitor_and_process_videos():
    """Continuously monitors the uploads folder for new videos and processes them."""
    while True:
        videos = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".webm") or f.endswith(".mp4")]
        
        if not videos:
            logging.info("No new videos found. Sleeping for 10 seconds...")
            time.sleep(10)
            continue

        for video in videos:
            video_path = os.path.join(UPLOAD_FOLDER, video)
            
            # Skip processing if result already exists
            if video in video_results:
                logging.info(f"Skipping already processed video: {video}")
                os.remove(video_path)
                continue
            
            logging.info(f"Processing video: {video}")

            report = process_video(video_path)

            if report:
                logging.info(f"Processing complete: {json.dumps(report, indent=2)}")

            try:
                os.remove(video_path)
                logging.info(f"Deleted processed video: {video}")
            except Exception as e:
                logging.error(f"Error deleting video {video}: {e}")

        logging.info("All videos processed. Sleeping for 10 seconds...")
        time.sleep(10)
        
@app.route('/videoupload',methods=['POST'])
def video_upload():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files['video']
    original_filename = video.filename  
    video_path = os.path.join(DIRECT_UPLOAD, original_filename)
    video.save(video_path)
    uploadresult=process_video(video_path)
    return jsonify(uploadresult)

@app.route('/upload', methods=['POST'])
def upload_video():
    """Handles video uploads and saves them to the local folder."""
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files['video']
    
   

    # Use the original filename from frontend
    original_filename = video.filename  
    video_path = os.path.join(UPLOAD_FOLDER, original_filename)
    video.save(video_path)

    logging.info(f"Saved video: {original_filename}")

    return jsonify({"message": "Video uploaded successfully", "file_name": original_filename}), 200

@app.route('/result/<filename>', methods=['GET'])
def get_video_result(filename):
    """Retrieves the processed result for a given video filename."""
    video_results = load_results()  # Reload results to get the latest data
    if filename in video_results:
        return jsonify(video_results[filename]), 200
    else:
        return jsonify({"error": "Result not found or still processing"}), 404

if __name__ == "__main__":
    import threading
    threading.Thread(target=monitor_and_process_videos, daemon=True).start()  
    app.run(host="0.0.0.0", port=5000)
