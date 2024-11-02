import { Component } from '@angular/core';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-popup-borrar',
  standalone: true,
  imports: [],
  templateUrl: './popup-borrar.component.html',
  styleUrl: './popup-borrar.component.css'
})
export class PopupBorrarComponent {
constructor(
    private router: Router,
    
  ) { }
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}