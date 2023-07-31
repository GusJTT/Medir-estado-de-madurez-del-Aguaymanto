import tensorflow as tf
import PIL
import PIL.Image
import pathlib
import datetime
import pytz
dataset_dir = "./Datos/Dataset"
test_dir = "./Datos/prueba"
dataset_dir = pathlib.Path(dataset_dir)
test_dir = pathlib.Path(test_dir)

#Cargando Imagenes a un dataset
img_height = 180
img_width = 180
batch_size = 32

#Creando dataset de entrenamiento
train_ds = tf.keras.utils.image_dataset_from_directory(
  dataset_dir,
  validation_split=0.30,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)

#Creando dataset de validacion
val_ds = tf.keras.utils.image_dataset_from_directory(
  dataset_dir,
  validation_split=0.30,
  subset="validation",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)
  
#Creando dataset de prueba
test_ds = tf.keras.utils.image_dataset_from_directory(
  test_dir,
  image_size=(img_height, img_width))

#Normalizando
train_ds = train_ds.map(lambda x,y: (x/255, y))
val_ds = val_ds.map(lambda x,y: (x/255, y))
test_ds = test_ds.map(lambda x,y: (x/255, y))

#Aumento de datos
data_augmentation = tf.keras.Sequential([
  tf.keras.layers.RandomFlip("horizontal_and_vertical"),
  tf.keras.layers.RandomRotation(0.2),
  tf.keras.layers.RandomZoom(0.3),
])

modelCNN2_AD = tf.keras.Sequential([
    #Añadiendo datos aumentados
    data_augmentation,

    # Agregar el primer par de capas convolucionales y agrupación
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    # Agregar el segundo par de capas convolucionales y agrupación
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    # Agregar el tercer par de capas convolucionales y agrupación
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    # Agregar el cuarto par de capas convolucionales y agrupación
    tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    # Aplanar los mapas de características en un vector unidimensional
    tf.keras.layers.Flatten(),

    # Agregar una capa densa de 250 neuronas
    tf.keras.layers.Dense(250, activation='relu'),

    # Agregar una capa densa de clasificación
    tf.keras.layers.Dense(1, activation='sigmoid')
])

lr = 0.00001
opt = tf.keras.optimizers.Adam(learning_rate=lr)
modelCNN2_AD.compile(
  optimizer=opt,
  loss=tf.losses.BinaryCrossentropy(from_logits=False),
  metrics=['accuracy'])

log_dir = "./logs/"

log_dir = log_dir + datetime.datetime.now(pytz.timezone('America/Lima')).strftime("%Y-%m-%d %H:%M:%S")
tensorBoardCNN2_AD = tf.keras.callbacks.TensorBoard(log_dir=log_dir)

#Entrenando el modelo
modelCNN2_AD.fit(
  train_ds,
  validation_data=val_ds,
  epochs=150, callbacks = [tensorBoardCNN2_AD]
)
print("Carpeta: " + log_dir)

#Guardando red entrenada
modelCNN2_AD.save('estado-madurez-cnn-ad.h5')
