import tensorflow as tf
import os
from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from CNN.predecir import predecir

model = tf.keras.models.load_model(os.getcwd() + '/CNN/estado-madurez-cnn-ad.h5')
# Create your views here.

def index(request):
  template = loader.get_template('index.html')
  print(request.method)
  if request.method == "POST":
    print("Aqui")
    #image = request.FILES['archImagen']
    image = request.FILES['archImagen']
    print(image)
    resultado = predecir(image, model)
    context = {
      'resultado': resultado,
    }
    print(context)
    return HttpResponse(template.render(context, request))
  return HttpResponse(request)
