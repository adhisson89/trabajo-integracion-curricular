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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

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
        text: 'Problema en el envío de la foto. Por favor, completa el formulario correctamente.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Obtener el archivo directamente del formulario
    const file: File = this.registroForm.get('foto')?.value;
    if (!file) {
      Swal.fire({
        title: 'Atención',
        text: 'No se seleccionó ningún archivo.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Crear el FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file, 'imagen.jpg');

    // Mostrar el Swal mientras se procesa
    Swal.fire({
      title: 'Procesando...',
      text: 'Estamos verificando el rostro, por favor espere.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // URL del backend
    const apiUrl = 'http://localhost:8080/api/face-recognition/compareFace';

    // Enviar la solicitud al backend
    fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Convertir respuesta a JSON
      })
      .then(data => {
        try {
          Swal.close(); // Cerrar el Swal de "Procesando..."
          console.log('Respuesta del backend:', data);

          if (data.status === 'True') {
            const matchDetails = data.match_details;
            Swal.fire({
              title: '¡Éxito!<br> La persona ingresada posee un registro criminal',
              html: `
              <p><strong>Datos del Delincuente</strong></p>
                <p><strong>ID: </strong><small>${matchDetails.identification}</small></p>
                <p><strong>Nombres: </strong><small>${matchDetails.name}</small></p>
                <p><strong>Apellidos:</strong> <small>${matchDetails.surename}</small></p>
                <p><strong>Modus Operandi:</strong> <small>${matchDetails.role}</small></p>
                <p><strong>Score:</strong> <small>${data.score.toFixed(2)}</small></p>
              `,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          } else if (data.status === 'False') {
            Swal.fire({
              title: 'Error!<br> La persona no posee un registro criminal',
              text: 'No se encontró un rostro coincidente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          } else {
            Swal.fire({
              title: 'Error inesperado',
              text: 'No se pudo procesar la solicitud correctamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            console.error('Respuesta inesperada:', data);
          }
        } catch (error) {
          console.error('Error al procesar los datos del backend:', error);
          Swal.fire({
            title: 'Error de formato',
            text: 'La respuesta del servidor no tiene el formato esperado.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      })
      .catch(error => {
        Swal.close(); // Cerrar el Swal de "Procesando..." en caso de error
        console.error('Error en la comunicación con el backend:', error);
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      });
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.registroForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }
}
