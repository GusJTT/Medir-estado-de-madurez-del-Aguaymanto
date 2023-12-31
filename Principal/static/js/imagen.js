//Elementos html
const elementoVideo = document.getElementById("camera-stream");
const elementoArchivo = document.getElementById("image-file-input");
const divImagen = document.getElementById("div-image");
var canvas = document.getElementById("campoImagen");
const form = document.getElementById("subirImagen");
var propiedades = {audio: false, video: true};
var canvasDim = [divImagen.clientWidth,divImagen.clientHeight];//+180+120, +90,+60, +45,+30
var modelo = null;
var formElement = document.forms.subirImagen;

//Asignando csrftoken a la cabecera de la peticion
//Funcion para obtener el token del html
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      console.log('paso');
      const cookies = document.cookie.split(';');
      console.log(cookies);
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          console.log(cookies);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              console.log('dentro');
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

$(document).ready(function(){
  $(function () {
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": csrftoken
      }
    });
  });
});
//Pidiendo permisos para camara
/*navigator.mediaDevices.getUserMedia(propiedades)
.then(//Si se acepta el permiso, inicia stream de video
  (stream) => {
    elementoVideo.srcObject = stream;
    console.log(stream)
  }
)
.catch((error) => {
  console.log(error);
})*/
    
    //Cargando el modelo
    /*(async() => {
      console.log("Cargando modelo...");
      modelo = await tf.loadLayersModel("modelo/model.json");
      console.log("Modelo cargado");
    })();*/
    
//Asignando listeners a los elementos html
/*document.getElementById("tomarFotoBoton").addEventListener("click", () => {
  mostrarImagenCanvas(video, canvas, canvasDim[0], canvasDim[1]);
})*/
/*elementoArchivo.addEventListener("change", (event) => {
  console.log("cambiado");
  mostrarArchivoCanvas();
  event.preventDefault()
  form.submit();
})*/

console.log("Modelo cargado")

$(document).on('change','#subirImagen',function(e){
  e.preventDefault();
  mostrarArchivoCanvas();
  let formData = new FormData(formElement);
  formData.append('medio', '1');//0: video, 1: imagen
  console.log(csrftoken);
  formData.append('CSRF', getCookie('csrf_token'));
  $.ajax({
    url: "",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success:function(html){
      $("#resultadoImg").replaceWith($('#resultadoImg', $(html)));
    },
  })
});

//Recibe un imagen cargada y lo muestra en un canvas
function mostrarArchivoCanvas(){
  const archivo = elementoArchivo.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(archivo);
  img.onload = function() {
    mostrarImagenCanvas(img, canvas, canvasDim[0], canvasDim[1]);
  };
}
    
//Recibe una imagen y lo muestra en un canvas
function mostrarImagenCanvas(imagen, canvas, ancho, alto){
  let ctx = canvas.getContext('2d');
  //Necesario para un dimensionamiento correcto
  canvas.width = ancho;
  canvas.height = alto;
  ctx.drawImage(imagen, 0, 0, ancho, alto);
}


