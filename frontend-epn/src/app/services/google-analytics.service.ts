import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor(private router: Router) {
    // Escucha los cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (typeof gtag === 'function') {
          gtag('config', 'G-0E5HY2CEBX', { page_path: event.urlAfterRedirects });
        } else {
          console.warn('gtag is not defined');
        }
      }
    });
  }
}
