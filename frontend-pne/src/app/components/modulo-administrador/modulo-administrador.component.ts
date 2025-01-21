import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modulo-administrador',
  standalone: true,
  imports: [],
  templateUrl: './modulo-administrador.component.html',
  styleUrl: './modulo-administrador.component.css'
})
export class ModuloAdministradorComponent {
  constructor(
    private router: Router,

  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}