import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import Swal from 'sweetalert2';


// Swal.fire({
//   title: '¿Estás seguro?',
//   text: 'No podrás revertir esta acción.',
//   icon: 'warning',
//   showCancelButton: true,
//   confirmButtonText: 'Sí, continuar',
//   cancelButtonText: 'Cancelar',
// }).then((result) => {
//   if (result.isConfirmed) {
//       // Acción al confirmar
//       console.log('Confirmado');
//   }
//});

@Component({
  selector: 'app-modulo-registro',
  templateUrl: './modulo-registro.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  styleUrls: ['./modulo-registro.component.css'],
})
export class ModuloRegistroComponent implements OnInit {
  registroForm!: FormGroup;
  selectedMode: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      foto: [null, Validators.required], // Foto es obligatoria
      modus: ['', Validators.required],
      identificacion: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s]+$/)]],
      alias:  ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]], 
      tipoDelito: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]], 
      sentencia: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]], 
    });
  }

  redirectTo(route: string, mode: string) {
    this.selectedMode = mode;
    this.registroForm.get('modus')?.setValue(mode);
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
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Por favor, inicia sesión primero.');
      this.router.navigate(['/inicio-sesion']);
      return Promise.reject('Token no encontrado');
    }

    formData.append('photo', file);
    formData.append('token', token);

    return this.http
      .post('http://localhost:8080/api/administration/management/image', formData)
      .toPromise();
  }

  sendFormData(imageId: string): void {
    const token = localStorage.getItem('authToken');
    const formData = {
      token: token,
      identification: this.registroForm.get('identificacion')?.value,
      name: this.registroForm.get('nombres')?.value.toUpperCase(),
      surename: this.registroForm.get('apellidos')?.value.toUpperCase(),
      role: this.registroForm.get('modus')?.value.toUpperCase(),
      photo_id: imageId,
      other_data: [

        
        {
          key: 'ALIAS',
          value: this.registroForm.get('alias')?.value.toUpperCase(),
        },
        {
          key: 'TIPO DE DELITO',
          value: this.registroForm.get('tipoDelito')?.value,//VER 
        },
        {
          key: 'SENTENCIA',
          value: this.registroForm.get('sentencia')?.value.toUpperCase(),
        },
       
      ],
    };

    console.log(formData);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    
    this.http
      .post('http://localhost:8080/api/administration/management/person', formData, { headers })
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
        },
      });
  }

  onSubmit(): void {
    

    const file = this.registroForm.get('foto')?.value;
console.log(file);
    if (file instanceof File) {
      this.uploadImage(file)
        .then((response: any) => {
          console.log('Imagen subida correctamente', response);
          const imageId = response.imageId; // Asegúrate de que el backend devuelva este valor
          console.log(imageId)
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
      alert('Por favor selecciona una imagen válida.');
    }
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.registroForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }

  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  preventNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }
}
