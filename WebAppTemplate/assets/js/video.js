let stream;
const videoElement = document.getElementById("camera-stream");
const toggleLink = document.getElementById("toggle-camera");

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        toggleLink.textContent = "Desactivar Cámara";
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

function stopCamera() {
    if (stream) {
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
