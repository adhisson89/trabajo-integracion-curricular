import { Component } from '@angular/core';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-popup-editar',
  standalone: true,
  imports: [],
  templateUrl: './popup-editar.component.html',
  styleUrl: './popup-editar.component.css'
})
export class PopupEditarComponent {
constructor(
    private router: Router,
    
  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}