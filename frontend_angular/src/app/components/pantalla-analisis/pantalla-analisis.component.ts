import * as faceapi from 'face-api.js';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-analisis',
  templateUrl: './pantalla-analisis.component.html',
  styleUrls: ['./pantalla-analisis.component.css']
})
export class PantallaAnalisisComponent implements OnInit, OnDestroy {
  videoRef: any;
  statusIcon: HTMLImageElement | null = null;
  stream: MediaStream | null = null; // Para almacenar el stream de la cámara

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
      video: { width: 600, height: 300 },
      audio: false
    }).then(stream => {
      this.stream = stream; // Guardar el stream para detenerlo más tarde
      if (this.videoRef) {
        this.videoRef.srcObject = stream;

        this.videoRef.addEventListener('loadedmetadata', () => {
          this.videoRef.width = this.videoRef.videoWidth || 600;
          this.videoRef.height = this.videoRef.videoHeight || 300;
          this.videoRef.play();
          this.detectFaces();
        });
      }
    }).catch(error => {
      console.error("Error al acceder a la cámara:", error);
    });
  }

  async detectFaces() {
    if (!this.videoRef) return;

    const videoElement = this.videoRef as HTMLVideoElement;

    videoElement.addEventListener('loadeddata', async () => {
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        console.error("Dimensiones del video no válidas.");
        return;
      }

      const canvas = faceapi.createCanvasFromMedia(videoElement);
      document.body.append(canvas);

      const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
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

  // Detiene la cámara cuando el componente se destruye
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop()); // Detener todos los tracks del stream
      console.log("Cámara desactivada");
    }
  }

  // Captura un frame del video como JPG
  captureImageAsJPG() {
    if (this.videoRef) {
      const canvas = faceapi.createCanvasFromMedia(this.videoRef);
      canvas.width = this.videoRef.videoWidth;
      canvas.height = this.videoRef.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(this.videoRef, 0, 0, canvas.width, canvas.height);

        // Convertir a Blob (formato JPEG)
        canvas.toBlob((blob) => {
          if (blob) {
            this.sendToBackend(blob);
          }
        }, 'image/jpeg', 0.95); // 0.95 es la calidad del JPEG
      }
    }
  }

  // Envía el archivo JPG al backend
  sendToBackend(blob: Blob) {
    fetch('http://localhost:8080/api/face-recognition/compare', {
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
    })
    .catch(err => console.error('Error en la solicitud:', err));
  }
}
