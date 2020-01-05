'''
Load previous Mnist CNN model and prep for app
based upon: https://github.com/sleepokay/mnist-flask-app/blob/master/model/load.py
'''

from tensorflow import keras
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras import backend as K

import json

def get_model():
    num_classes = 10
    img_rows, img_cols = 28, 28

    # check which format of images the backend is using and ensure images are in the proper format
    # channels last: (rows, cols, channels)
    # channels first: (channels, rows, cols)
    if K.image_data_format() == 'channels_first':
        input_shape = (1, img_rows, img_cols)
    else:
        input_shape = (img_rows, img_cols, 1)

    # model structure
    model = Sequential()
    model.add(Conv2D(32, kernel_size=(3, 3),
                     activation='relu',
                     input_shape=input_shape))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(num_classes, activation='softmax'))

    # load weights
    model.load_weights("./model/weights.h5")
    print("Model weights loaded")

    # compile and evaluate loaded model
    model.compile(loss=keras.losses.categorical_crossentropy,
                  optimizer=keras.optimizers.Adadelta(),
                  metrics=['accuracy'])

    return model