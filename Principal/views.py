import tensorflow as tf
import os
from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from CNN.predecir import predecir

# Create your views here.

def index(request):
  model = tf.keras.models.load_model(os.getcwd() + '/CNN/estado-madurez-cnn-ad.h5')
  template = loader.get_template('index.html')
  print(request.method)
  if request.method == "POST":
    try:
      image = request.FILES['archImagen']
      resultado = predecir(image, model)
      context = {
        'resultado': resultado,
      }
      return HttpResponse(template.render(context, request))
    except:
      print("Exception")
  return HttpResponse(request)
