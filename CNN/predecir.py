import cv2
import os
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

#Cargando dataset de prueba
"""test_path = "./Datos/prueba"
test_batches = ImageDataGenerator(rescale=1./255) \
    .flow_from_directory(directory=test_path, target_size=(180,180), classes=['Inmaduro', 'Maduro'], batch_size=20, shuffle=False)"""

#Para probar funcion
"""model = tf.keras.models.load_model(os.getcwd() + '/CNN/estado-madurez-cnn-ad.h5')
   img=cv2.imread("./Datos/Dataset/Inmaduro/200.jpg")
   predecir("./Datos/Dataset/Inmaduro/200.jpg", model)"""
   
#Funcion para predecir
def predecir(imagen, modelo):
  #Cargando la imagen
  img = cv2.imdecode(np.fromstring(imagen.read(), np.uint8), cv2.IMREAD_COLOR)
  try:
    #Cambiando el tamaño al aceptado por el modelo
    resize = tf.image.resize(img, (180,180))
    #Prediciendo
    prediccion = modelo.predict(np.expand_dims(resize/255, 0))
    #Asignado salida de la predicion a un valor (0: inmaduro, 1: maduro)
    if prediccion > 0.5:
      print("Maduro")
      return "Maduro"
    else:
      print("Inmaduro")
      return "Inmaduro"
  except:
    print('Error al cargar imagen')


