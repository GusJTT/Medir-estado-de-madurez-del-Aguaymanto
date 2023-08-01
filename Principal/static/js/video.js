let stream;
const videoElement = document.getElementById("camera-stream");
const toggleLink = document.getElementById("toggle-camera");
const videoCaptura = document.getElementById("captura-video");
var estadoCamara = 0;

async function startCamera() {
    try {
        estadoCamara = 1;
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        toggleLink.textContent = "Desactivar Cámara";
        procesarCamara();
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

function stopCamera() {
    if (stream) {
        estadoCamara = 0;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoElement.srcObject = null;
        stream = null;
        toggleLink.textContent = "Activar Cámara";
    }
}

function toggleCamera() {
    if (stream) {
        stopCamera();
    } else {
        startCamera();
    }
}

toggleLink.addEventListener('click', toggleCamera);

videoCaptura.width = videoElement.clientWidth;
videoCaptura.height = videoElement.clientHeight;
function procesarCamara(){
  let ctx = videoCaptura.getContext('2d');
  ctx.drawImage( videoElement, 0, 0, videoCaptura.width, videoCaptura.height );
  let frameVideo = ctx.getImageData(0, 0, 180, 180).data;
  let formData = new FormData();
  formData.append('medio', '0');//0: video, 1: imagen
  formData.append('frame', JSON.stringify(frameVideo));
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
  if (estadoCamara == 1){
    setTimeout(procesarCamara, 500);
  }
}
