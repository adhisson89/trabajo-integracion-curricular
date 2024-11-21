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
function filterItems(): void {
  const filterValue = (document.getElementById("filterSelect") as HTMLSelectElement).value;
  const items = document.querySelectorAll(".item") as NodeListOf<HTMLLIElement>;

  items.forEach(item => {
      const itemCategory = item.getAttribute("data-category");
      if (filterValue === "all" || itemCategory === filterValue) {
          item.style.display = "flex";
      } else {
          item.style.display = "none";
      }
  });
}
