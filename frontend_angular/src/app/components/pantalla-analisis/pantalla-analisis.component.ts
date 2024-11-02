import { Component } from '@angular/core';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-pantalla-analisis',
  standalone: true,
  imports: [],
  templateUrl: './pantalla-analisis.component.html',
  styleUrl: './pantalla-analisis.component.css'
})
export class PantallaAnalisisComponent {
constructor(
    private router: Router,
    
  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}