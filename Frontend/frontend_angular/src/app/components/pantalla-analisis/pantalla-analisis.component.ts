import * as faceapi from 'face-api.js';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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


  captureImageAsJPG(): void {
    if (this.videoRef) {
      const canvas = document.createElement('canvas');
      canvas.width = this.videoRef.videoWidth;
      canvas.height = this.videoRef.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(this.videoRef, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            this.sendToBackend(blob);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  }


  
  sendToBackend(blob: Blob): void {
    const formData = new FormData();
    formData.append('file', blob, 'imagen.jpg');
    
    fetch('http://localhost:8080/api/face-recognition/compareFace', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
        console.log('Imagen enviada exitosamente');
      } else {
        console.error('Error al enviar la imagen');
      }
    }).catch(err => console.error('Error en la solicitud:', err));
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