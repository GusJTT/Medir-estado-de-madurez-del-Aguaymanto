import cv2
import json
import os
import tensorflow as tf
import numpy as np
from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from CNN.predecir import predecir
from django.views.decorators.csrf import ensure_csrf_cookie

model = tf.keras.models.load_model(os.getcwd() + '/CNN/estado-madurez-cnn-ad.h5')
# Create your views here.

@ensure_csrf_cookie
def index(request):
  template = loader.get_template('index.html')
  if request.method == "POST":
    resultado = ""
    medio = request.POST.get('medio')
    #Si es imagen (medio = 1)
    if(medio == '1'):
      imagen = request.FILES['archImagen']
      imagen = cv2.imdecode(np.fromstring(imagen.read(), np.uint8), cv2.IMREAD_COLOR)
      resultado = predecir(imagen, model)
      print('aqui1')
      
    #Si es video (medio = 0)
    elif(medio == '0'):
      imagen = request.POST.get('frame')
      imagen = list(json.loads(imagen).values())
      imagen = np.array(imagen).reshape(180, 180, 4).astype(np.uint8)
      imagen = cv2.cvtColor(imagen, cv2.COLOR_RGBA2RGB)
      resultado = predecir(imagen, model)
      print('aqui0')
    context = {
      'resultado': resultado,
    }
    return HttpResponse(template.render(context, request))
  return HttpResponse(template.render())
