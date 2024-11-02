import { Component } from '@angular/core';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-modulo-listado',
  standalone: true,
  imports: [],
  templateUrl: './modulo-listado.component.html',
  styleUrl: './modulo-listado.component.css'
})
export class ModuloListadoComponent {
constructor(
    private router: Router,
    
  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}