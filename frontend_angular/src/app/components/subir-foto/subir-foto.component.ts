import { Component, OnInit } from '@angular/core';
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
  styleUrl: './subir-foto.component.css'
})

export class SubirFotoComponent implements OnInit {
  registroForm!: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      foto: [null, Validators.required], // Foto es obligatoria

    });
  }

  redirectTo(route: string, mode: string) {
    this.router.navigate([route], { state: { selectedMode: mode } });
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

  uploadImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http
      .post('http://localhost:8080/api/administration/management/image', formData)
      .toPromise();
  }

  sendFormData(imageId: string): void {
    
    const formData = {
      photo_id: imageId,
     
    };

    this.http
      .post('http://localhost:8080/api/administration/management/person', formData)
      .subscribe({
        next: (response) => {
          console.log('Formulario enviado exitosamente', response);
          Swal.fire({
            title: '¡Éxito!',
            text: 'Datos enviados con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (error) => {
          console.error('Error al enviar los datos:', error);
          alert('Error al enviar los datos.');
          Swal.fire({
            title: 'Error',
            html: '<p>Error al enviar los datos.</p><p>Verifíca que los campos esten completos</p>',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      Swal.fire({
        title: 'Atención',
        text: 'Por favor complete todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const file = this.registroForm.get('foto')?.value;

    if (file instanceof File) {
      this.uploadImage(file)
        .then((response: any) => {
          console.log('Imagen subida correctamente', response);
          const imageId = response.imageId; // Asegúrate de que el backend devuelva este valor
          if (imageId) {
            this.sendFormData(imageId);
          } else {
            throw new Error('imageId no recibido del servidor.');
          }
        })
        .catch((error) => {
          console.error('Error al subir la imagen', error);
          Swal.fire({
            title: 'Error',
            text: 'Error al subir la imagen.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
          });
        });
    } else {
    
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona una imagen válida.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.registroForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }

}
