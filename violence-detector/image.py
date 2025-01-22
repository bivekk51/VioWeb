import cv2
import IPython
import tensorflow as tf
from keras.models import load_model
import numpy as np
import base64
import time


__model=None

from tensorflow.keras.layers import DepthwiseConv2D
from tensorflow.keras.models import load_model

def custom_depthwise_conv2d(**kwargs):
    if 'groups' in kwargs:
        del kwargs['groups']
    return DepthwiseConv2D(**kwargs)


#Loading the MOdel
def load_saved_artifacts():

    print("Loading the artifacts at once!")

    global __model
    if __model is None:
        with open("modelnew.h5", "rb") as f:
            __model = load_model("modelnew.h5", custom_objects={"DepthwiseConv2D": custom_depthwise_conv2d})

            print("Artifacts are loaded!")



#Classifies image and returns an index for a celebrity
def classify_image(image_base64_data, file_path=None):
    # Record the start time
    start_time = time.time()

    print("classifying image....")
    imgs=get_cropped_image_if_2_eyes(file_path,image_base64_data)
    img = cv2.resize(imgs, (128, 128))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)  # Shape: (1, 224, 224, 3)
    result=[]
    print("going to predict")
    res=__model.predict(img)
    print(res)
    result.append({
            "class":str(res[0][0])
            
            })
    # if(res[0][0]>0.4):
    #     confidence=result[0]['class'][0][0]
    #     print(f"Students are Fighting (Confidence= {confidence}) ")    
    # Record the end time
    end_time = time.time()

    # Calculate the time taken
    time_taken = end_time - start_time
    print(f"Time taken: {time_taken} seconds for classifying 1 image frame")
    return result



        


#Takes a base64 string of image and returns a cv2 image
def get_cv2_image_from_base64_string(b64str):
    encoded_data=b64str.split(',')[1]
    nparr=np.frombuffer(base64.b64decode(encoded_data),np.uint8)
    img= cv2.imdecode(nparr,cv2.IMREAD_COLOR)
    return img



#Checks if the image has 2 eyes of the person visible and cropping the image if TRUE
def get_cropped_image_if_2_eyes(image_path,image_base64_data):

    img=get_cv2_image_from_base64_string(image_base64_data)                 #This has array of rectangles of eyes from gray face area image
    return img            
            
    


def get_b64_test_image_for_virat():
    print("getting b64 from file")

    with open("b64.txt") as f:
        return f.read()
    

if __name__ == "__main__":
    # load_saved_artifacts()
    classify_image(get_b64_test_image_for_virat(),None)