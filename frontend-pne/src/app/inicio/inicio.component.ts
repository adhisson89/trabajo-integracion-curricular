import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
 
  constructor(private router: Router) { }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

}
