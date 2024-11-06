import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-modulo-registro',
  standalone: true,
  imports: [],
  templateUrl: './modulo-registro.component.html',
  styleUrl: './modulo-registro.component.css'
})
export class ModuloRegistroComponent {

  

  // Variable para almacenar el modo seleccionado
  selectedMode: string = '';

  constructor(private router: Router) { }

  // Actualiza el modo seleccionado y redirige a la ruta indicada
  redirectTo(route: string, mode: string) {
    this.selectedMode = mode;  // Establece el modo seleccionado
    this.router.navigate([route]);  // Redirige a la ruta indicada
  }


}