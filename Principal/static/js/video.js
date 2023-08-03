var currentStream;
const videoElement = document.getElementById("camera-stream");
const toggleLink = document.getElementById("toggle-camera");
const videoCaptura = document.getElementById("captura-video");
var videoSelect = document.getElementById("video-source");
//Indica si esta activa o no
var estadoCamara = 0;
//Modo de camara
var facingMode = "user";
//Valor de camara escogida (id)
var videoSource = videoSelect.value;
//Opciones para iniciar camara
var opciones = {
  video: {
    facingMode: facingMode,
  }
};
//Listener para boton activar camara
toggleLink.addEventListener('click', toggleCamera);
//Listener para seleccionar camara
videoSelect.addEventListener('change', cambiarCamara);

//Cambiar entre acticado y desactivado
function toggleCamera() {
    if (currentStream) {
        stopCamera();
    } else {
        startCamera();
    }
}

//Iniciar camara
function startCamera() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(opciones)
    .then(function(stream) {
      currentStream = stream;
      videoElement.srcObject = currentStream;
      estadoCamara = 1;
      toggleLink.textContent = "Desactivar Cámara";
      procesarCamara();
    })
    .catch(function(err) {
      alert("No se pudo utilizar la camara :(");
      console.log(err);
      alert(err);
    })
  } else {
    alert("No existe la funcion getUserMedia");
  }
}

//Detener camara
function stopCamera() {
  if (currentStream) {
    estadoCamara = 0;
    const tracks = currentStream.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.srcObject = null;
    currentStream = null;
    toggleLink.textContent = "Activar Cámara";
	document.getElementById("resultadoVid").textContent="Prediccion: ";
  }
}

//Funcion para cambiar por camara seleccionada
function cambiarCamara() {
  videoSource = videoSelect.value;
  opciones = {
    audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  if (currentStream) {
    currentStream.getTracks().forEach(track => {
      track.stop();
    });
	navigator.mediaDevices.getUserMedia(opciones)
    .then(function(stream) {
      currentStream = stream;
      videoElement.srcObject = currentStream;
    })
    .catch(function(err) {
      console.log("Hubo un error", err);
    })
  }
}

videoCaptura.width = videoElement.clientWidth;
videoCaptura.height = videoElement.clientHeight;

//Funcion para obtener frames del video y madarlos a la vista
function procesarCamara(){
  if (estadoCamara == 1){
	//Almacenando frames en un canvas
	let ctx = videoCaptura.getContext('2d', { willReadFrequently: true });
    ctx.drawImage( videoElement, 0, 0, videoCaptura.width, videoCaptura.height );
	//Obteniendo imagen del canvas
    let frameVideo = ctx.getImageData(0, 0, 180, 180).data;
	//Cargando datos de imagenes para su envio
    let formData = new FormData();
    formData.append('medio', '0');//0: video, 1: imagen
    formData.append('frame', JSON.stringify(frameVideo));
	//Enviando
    $.ajax({
      url: "",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success:function(html){
        $("#resultadoVid").replaceWith($('#resultadoVid', $(html)));
      }
    })
	//Actualizar imaganes cada 500ms
	myTimeout = setTimeout(procesarCamara, 500);
  }
}

//Obteniendo las camaras disponibles
navigator.mediaDevices.enumerateDevices().then((devices) => {
  // Iterando por la lista de dispositivos (InputDeviceInfo and MediaDeviceInfo)
  devices.forEach((device) => {
    let option = new Option();
    option.value = device.deviceId;
    // Cargando de acuerdo al tipo
    switch(device.kind){
    // Añadiendo dispositivo a la lista de camaras
      case "videoinput":
        option.text = device.label || `Camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
        break;
    }
    console.log(device);
  });
}).catch(function (e) {
  console.log(e.name + ": " + e.message);
});