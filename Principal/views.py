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
  if request.method == "POST":
    image = request.FILES['archImagen']
    resultado = predecir(image, model)
    context = {
      'resultado': resultado,
    }
    return HttpResponse(template.render(context, request))
  return HttpResponse(template.render())
