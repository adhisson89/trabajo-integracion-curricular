import * as faceapi from 'face-api.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-analisis',
  templateUrl: './pantalla-analisis.component.html',
  styleUrls: ['./pantalla-analisis.component.css']
})
export class PantallaAnalisisComponent implements OnInit {
  videoRef: any;
  statusIcon: HTMLImageElement | null = null;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    // Referencia al elemento de video
    this.videoRef = document.getElementById('video');
    this.statusIcon = document.getElementById('status-icon') as HTMLImageElement;

    // Cargar los modelos
    await this.loadModels();

    // Configurar la cámara
    this.setupCamara();
  }

  async loadModels() {
    const modelPath = './assets/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
    console.log('Modelos de face-api.js cargados correctamente');
  }

  setupCamara() {
    navigator.mediaDevices.getUserMedia({
      video: { width: 600, height: 300 }, // Establecer dimensiones específicas
      audio: false
    }).then(stream => {
      if (this.videoRef) {
        this.videoRef.srcObject = stream;

        // Asegúrate de que el video tenga dimensiones
        this.videoRef.addEventListener('loadedmetadata', () => {
          this.videoRef.width = this.videoRef.videoWidth || 600;
          this.videoRef.height = this.videoRef.videoHeight || 300;
          this.videoRef.play();
          this.detectFaces(); // Llama a detectFaces una vez que las dimensiones están listas
        });
      }
    }).catch(error => {
      console.error("Error al acceder a la cámara:", error);
    });
  }

  async detectFaces() {
    if (!this.videoRef) return;

    const videoElement = this.videoRef as HTMLVideoElement;

    // Asegurarse de que el video esté cargado antes de usarlo
    videoElement.addEventListener('loadeddata', async () => {
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        console.error("Dimensiones del video no válidas.");
        return;
      }

      const canvas = faceapi.createCanvasFromMedia(videoElement);
      document.body.append(canvas);

      const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight }; // Dimensiones válidas
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        if (detections.length > 0) {
          console.log('Rostro detectado:', detections);
        }
      }, 100);
    });
  }

  // Función para capturar una imagen
  captureImage() {
    if (this.videoRef) {
      const canvas = document.createElement('canvas');
      canvas.width = this.videoRef.videoWidth;
      canvas.height = this.videoRef.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(this.videoRef, 0, 0, canvas.width, canvas.height);
        const imageBlob = canvas.toDataURL('image/jpeg');
        this.sendToBackend(imageBlob);
      }
    }
  }

  // Enviar la imagen al backend
  sendToBackend(image: string) {
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
    const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'image/jpeg' });

    // Realiza el POST al backend
    fetch('http://localhost:3662/api/administration/management/image', {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('Imagen enviada exitosamente');
      } else {
        console.error('Error al enviar la imagen');
      }
    });
  }
}
