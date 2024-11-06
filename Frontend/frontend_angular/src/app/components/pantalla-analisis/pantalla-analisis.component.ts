/*import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-pantalla-analisis',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './pantalla-analisis.component.html',
  styleUrl: './pantalla-analisis.component.css'
})
export class PantallaAnalisisComponent implements OnInit {
  constructor(
    private router: Router,

  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  videoRef: any;
  ngOnInit(): void {
    this.videoRef = document.getElementById('video');
    console.log(this.videoRef);
    this.setupCamara();

    throw new Error('Method not implemented.');

  }

  setupCamara() {
    navigator.mediaDevices.getUserMedia({
      video: { width: 300, height: 250 },
      audio: false
    }).then(stram => {
      console.log(stram);
      this.videoRef.srcObject = stram;
    })
  }




  
}

*/


import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pantalla-analisis',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './pantalla-analisis.component.html',
  styleUrls: ['./pantalla-analisis.component.css']
})
export class PantallaAnalisisComponent implements OnInit {
  videoRef: any;
  statusIcon: HTMLImageElement | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Referencia al elemento de video
    this.videoRef = document.getElementById('video');
    // Referencia al elemento de estado de autenticación
    this.statusIcon = document.getElementById('status-icon') as HTMLImageElement;

    console.log(this.videoRef);
    this.setupCamara();

    // Aquí puedes llamar a setAuthenticationStatus para inicializar el estado
    this.setAuthenticationStatus(true); // Puedes cambiar a false para la "X"

    // Ejemplo de error implementado
    // throw new Error('Method not implemented.');
  }

  setupCamara() {
    navigator.mediaDevices.getUserMedia({
      video: { width: 300, height: 250 },
      audio: false
    }).then(stream => {
      console.log(stream);
      if (this.videoRef) {
        this.videoRef.srcObject = stream;
      }
    }).catch(error => {
      console.error("Error al acceder a la cámara:", error);
    });
  }

  // Función para actualizar el estado de autenticación
  setAuthenticationStatus(success: boolean) {
    if (this.statusIcon) {
      if (success) {
        this.statusIcon.src = './src/assets'; // Ícono de verificación
      } else {
        this.statusIcon.src = 'cross.png'; // Ícono de "X"
      }
      this.statusIcon.classList.remove('hidden'); // Mostrar el ícono
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
