from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import json
import logging
import re
from telegram import Bot
import asyncio
from datetime import datetime


# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Set the upload folder for video files
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
TELEGRAM_BOT_TOKEN = "7942578600:AAGvoDCo517xEvMWJ5xeuzqDAD3hLDYftsg"
TELEGRAM_CHAT_ID = "5110056847"  

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

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)
    try:
        result = subprocess.run(
            ['python', 'video.py', video_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,  
            text=True
        )

        
        raw_output = result.stdout.strip()
        
        print(raw_output)
        
        json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
        if json_match:
            report = json.loads(json_match.group(0))  
            if report.get("average_accuracy", 0) > 0.5:
                asyncio.run(send_telegram_alert(video_path,report))
            print("response sent")
            return jsonify(report)
        else:
            return jsonify({
                "error": "Failed to parse JSON",
                "details": raw_output
            }), 500
    except json.JSONDecodeError as e:
        logging.error("JSON decode error: %s", str(e))
        return jsonify({
            "error": "Invalid JSON from video.py",
            "details": str(e)
        }), 500
    except Exception as e:
        logging.error("Unexpected error: %s", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
