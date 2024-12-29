import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-foto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './subir-foto.component.html',
  styleUrls: ['./subir-foto.component.css'],
})
export class SubirFotoComponent implements OnInit {
  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  // PERIODO DE INACTIVIDAD
  private inactivityTimeout: any;
  private readonly inactivityTimeLimit: number = 300000; // 5 minutos
  private detectionInterval: any;

  registroForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  // Gestión de inactividad
  @HostListener('document:mousemove')
  @HostListener('document:click')
  @HostListener('document:keydown')
  handleUserActivity(): void {
    this.resetInactivityTimer();
  }

  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.handleInactivity();
    }, this.inactivityTimeLimit);
  }

  handleInactivity(): void {
    this.router.navigate(['/inicio']);
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      foto: [null, Validators.required], // Foto es obligatoria
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      this.registroForm.patchValue({ foto: file }); // Aseguramos que el archivo es de tipo 'File'
    } else {
      this.registroForm.patchValue({ foto: null });
      console.error('No se seleccionó un archivo válido');
    }
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      Swal.fire({
        title: 'Atención',
        text: 'Problema en el envío de la foto',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Obtenemos el archivo directamente del formulario
    const file = this.registroForm.get('foto')?.value;

    // URL de ejemplo
    const apiUrl = 'https://ejemplo.com/api/subir-foto';

    this.http.post(apiUrl, file, {
      headers: {
        'Content-Type': file.type, // El tipo MIME del archivo
      },
      responseType: 'text', // Si el servidor retorna texto plano
    }).subscribe(
      response => {
        Swal.fire({
          title: 'Éxito',
          text: 'La foto se ha subido correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        console.log('Respuesta del servidor:', response);
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al subir la foto. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        console.error('Error al subir la foto:', error);
      }
    );
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.registroForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }
}
