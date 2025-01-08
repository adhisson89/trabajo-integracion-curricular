import * as faceapi from 'face-api.js';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-analisis',
  templateUrl: './pantalla-analisis.component.html',
  styleUrls: ['./pantalla-analisis.component.css']
})
export class PantallaAnalisisComponent implements OnInit, OnDestroy {

  redirectTo(route: string) {

    this.router.navigate([route]);
  }

  private inactivityTimeout: any;
  private readonly inactivityTimeLimit: number = 300000; //300000-- 5 minutos ----30000---30s
  private detectionInterval: any;

  videoRef: HTMLVideoElement | null = null;
  statusIcon: HTMLImageElement | null = null;
  stream: MediaStream | null = null;

  constructor(private router: Router) { }

  // Gestión de inactividad
  @HostListener('document:mousemove')
  @HostListener('document:click')
  @HostListener('document:keydown')
  handleUserActivity(): void {
    this.resetInactivityTimer();
  }

  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.handleInactivity();
    }, this.inactivityTimeLimit);
  }

  handleInactivity(): void {
    this.router.navigate(['/inicio']);
  }

  async ngOnInit(): Promise<void> {
    this.resetInactivityTimer(); // Inicializa el temporizador
    this.videoRef = document.getElementById('video') as HTMLVideoElement;
    this.statusIcon = document.getElementById('status-icon') as HTMLImageElement;

    if (!this.videoRef) {
      console.error("Elemento de video no encontrado.");
      return;
    }

    await this.loadModels();
    this.setupCamara();
  }

  async loadModels(): Promise<void> {
    const modelPath = './assets/models';
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
      console.log('Modelos de face-api.js cargados correctamente');
    } catch (error) {
      console.error("Error al cargar los modelos:", error);
    }
  }

  setupCamara(): void {
    navigator.mediaDevices.getUserMedia({
      video: { width: 600, height: 300 },
      audio: false
    }).then(stream => {
      this.stream = stream;
      if (this.videoRef) {
        this.videoRef.srcObject = stream;

        this.videoRef.addEventListener('loadedmetadata', () => {
          this.videoRef?.play();
          this.detectFaces();
        });
      }
    }).catch(error => {
      console.error("Error al acceder a la cámara:", error);
    });
  }

  async detectFaces(): Promise<void> {
    if (!this.videoRef) return;

    const videoElement = this.videoRef;
    const canvas = document.getElementById('overlay-canvas') as HTMLCanvasElement;

    if (!canvas) {
      console.error('No se encontró el canvas para superponer');
      return;
    }

    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    faceapi.matchDimensions(canvas, displaySize);

    this.detectionInterval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }

      if (detections.length > 0) {
        console.log('Rostro detectado:', detections);
      }
    }, 100);
  }

  async captureImageAsJPG(): Promise<void> {
    if (this.videoRef) {
      const canvas = document.createElement('canvas');
      canvas.width = this.videoRef.videoWidth;
      canvas.height = this.videoRef.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Dibuja la imagen del video en el canvas
        context.drawImage(this.videoRef, 0, 0, canvas.width, canvas.height);

        // Detecta el rostro en la imagen
        const detections = await faceapi.detectAllFaces(this.videoRef, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          // Obtiene las coordenadas del primer rostro detectado (puedes mejorar esto para manejar varios rostros)
          const firstFace = detections[0].detection;

          // Recorta la zona del rostro del canvas
          const { x, y, width, height } = firstFace.box;
          const faceCanvas = document.createElement('canvas');
          faceCanvas.width = width;
          faceCanvas.height = height;
          const faceContext = faceCanvas.getContext('2d');
          if (faceContext) {
            // Recorta el rostro y lo dibuja en el nuevo canvas
            faceContext.drawImage(canvas, x, y, width, height, 0, 0, width, height);
          }

          // Convierte el canvas de la cara recortada a una URL base64
          const base64Image = faceCanvas.toDataURL('image/jpeg', 0.95);

          // Convierte la imagen en un blob para enviarla al backend
          faceCanvas.toBlob(blob => {
            if (blob) {
              console.log('Imagen recortada en formato Blob:', blob);
              this.sendToBackend(blob); // Envía la imagen al backend
            }
          }, 'image/jpeg', 0.95);
        } else {

          console.error('No se detectó rostro en la imagen');
        }
      }
    }
  }



  sendToBackend(blob: Blob): void {
    const formData = new FormData();
    formData.append('file', blob, 'imagen.jpg');

    // Muestra un swal para indicar que se está procesando
    Swal.fire({
      title: 'Procesando...',
      text: 'Estamos verificando el rostro, por favor espere.',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        console.log(`Procesando...`);
      }
    });

    // URL del backend
    fetch('http://localhost:8080/api/face-recognition/compareFace', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Convertir respuesta a JSON
      })
      .then(data => {
        try {
          if (!data.message) {
            throw new Error('La clave "message" no está presente en la respuesta.');
          }

          console.log('Mensaje del backend:', data.message); // Imprime la respuesta para diagnosticar
          let messageString = data.message;

          // Reemplaza las comillas simples por comillas dobles
          messageString = messageString.replace(/'/g, '"');

          // Asegúrate de que el mensaje sea un JSON válido
          const messageObject = JSON.parse(messageString);

          if (messageObject.status === 'True') {
            Swal.fire({
              title: '¡Éxito!',
              html: `<p>Persona Autorizada</p><p><strong>ID: </strong><small>${messageObject.match_details.identification}</small></p>
              <p><strong>NOMBRES: </strong><small>${messageObject.match_details.name}</small></p>
              <p><strong>APELLIDOS:</strong> <small>${messageObject.match_details.surename}</small></p>
              <p><strong>ROL:</strong><small>${messageObject.match_details.role}</small></p>`,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            console.log('Rostro reconocido, ID:', messageObject.match_details.identification);
          } else {
            Swal.fire({
              title: '¡Persona No Autorizada!',
              text: 'No se encontró un rostro coincidente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            console.error('No se encontró un rostro coincidente');
          }
        } catch (error) {
          console.error('Error al procesar el mensaje del backend:', error);
          Swal.fire({
            title: 'Error en el formato del mensaje',
            text: 'El mensaje recibido no es válido. Por favor, revisa el backend.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      })
      .catch(error => {
        console.error('Error en la comunicación con el backend:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.inactivityTimeout);
    clearInterval(this.detectionInterval);

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      console.log("Cámara desactivada");
    }
  }
}