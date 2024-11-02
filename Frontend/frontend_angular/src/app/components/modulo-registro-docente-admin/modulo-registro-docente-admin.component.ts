import { Component } from '@angular/core';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-modulo-registro-docente-admin',
  standalone: true,
  imports: [],
  templateUrl: './modulo-registro-docente-admin.component.html',
  styleUrl: './modulo-registro-docente-admin.component.css'
})
export class ModuloRegistroDocenteAdminComponent {
constructor(
    private router: Router,
    
  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}