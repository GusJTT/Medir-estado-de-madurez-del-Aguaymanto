//Elementos html
const elementoVideo = document.getElementById("camera-stream");
const elementoArchivo = document.getElementById("image-file-input");
const divImagen = document.getElementById("div-image");
var canvas = document.getElementById("campoImagen");
var propiedades = {audio: false, video: true};
var canvasDim = [divImagen.clientWidth,divImagen.clientHeight];//+180+120, +90,+60, +45,+30
var modelo = null;

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
elementoArchivo.addEventListener("change", (event) => {
  mostrarArchivoCanvas();
})
    
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
  console.log(ancho);
  console.log(alto);
  canvas.width = ancho;
  canvas.height = alto;
  ctx.drawImage(imagen, 0, 0, ancho, alto);
}
