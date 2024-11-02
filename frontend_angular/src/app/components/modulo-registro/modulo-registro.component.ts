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
constructor(
    private router: Router,
    
  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}