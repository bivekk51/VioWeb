import os
import sys
import json
import logging

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"#timroma yo line comment gara meroma GPU navara ho
logging.getLogger('tensorflow').setLevel(logging.ERROR)

import cv2
import numpy as np
import tensorflow as tf
import time
from tensorflow.keras.layers import DepthwiseConv2D

def custom_depthwise_conv2d(**kwargs):
    if 'groups' in kwargs:
        del kwargs['groups']
    return DepthwiseConv2D(**kwargs)


model = tf.keras.models.load_model(
    'modelnew.h5', custom_objects={"DepthwiseConv2D": custom_depthwise_conv2d}
)


IMG_SIZE = 128  
COLOR_CHANNELS = 3 


def log(message):
    print(message, file=sys.stderr)

def preprocess_frame(frame):
    
    frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE)) 
    frame = frame / 255.0 
    frame = np.expand_dims(frame, axis=0).astype(np.float32)
    return frame

def video_to_frames(video_path):
    frames = []
    cap = cv2.VideoCapture(video_path)
    log(f"Number of frames: {int(cap.get(cv2.CAP_PROP_FRAME_COUNT))}")
    fps = cap.get(cv2.CAP_PROP_FPS)
    log(f"Your video's FPS: {fps:.2f}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        preprocessed_frame = preprocess_frame(frame)
        frames.append(preprocessed_frame)
    cap.release()
    return frames

def classify_video(video_path):
    frames = video_to_frames(video_path)
    predictions = []
    frame_count = 0
    
    for frame in frames:
        try:
            if frame_count % 15 == 0:  
                log(f"Processing frame: {frame_count}")
                start_time = time.time()
                prediction = model.predict(frame, verbose=0)  
                predictions.append(prediction[0][0])
                log(f"Prediction: {predictions[-1]:.4f}")
                end_time = time.time()
                log(f"Time taken: {end_time - start_time:.2f} seconds\n")
        except Exception as e:
            log(f"Error processing frame {frame_count}: {e}")
            predictions.append(0)
        frame_count += 1
    
    if not predictions:
        log("No valid predictions were made.")
        return 0, 0

 
    average_prediction = np.mean(predictions)
    predictions = sorted(predictions)
    predicted_class = predictions[-1] 
    return predicted_class, average_prediction

#test
if __name__ == "__main__":
    if len(sys.argv) != 2:
        log("Usage: python video.py <video_path>")
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        highest_pred, avg_pred = classify_video(video_path)
        result = {
            "highest_accuracy": float(highest_pred),
            "average_accuracy": float(avg_pred),
        }
        print(json.dumps(result)) 
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
