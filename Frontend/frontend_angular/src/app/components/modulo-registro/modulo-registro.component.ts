// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule




// @Component({
//   selector: 'app-modulo-registro',
//   templateUrl: './modulo-registro.component.html',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
//   styleUrls: ['./modulo-registro.component.css']
// })
// export class ModuloRegistroComponent implements OnInit {
//   registroForm!: FormGroup;
//   selectedMode: string = '';

//   constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

//   ngOnInit(): void {
//     this.registroForm = this.fb.group({
//       foto: [null, Validators.required],  // Foto es obligatoria
//       modo: ['', Validators.required],
//       identificacion: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//       nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
//       apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
//       codigoUnico: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
//       unidadAcademica: ['', Validators.required]
//     });
//   }
//   redirectTo(route: string, mode: string) {
//     this.selectedMode = mode;
//     this.registroForm.get('modo')?.setValue(mode);
//     this.router.navigate([route], { state: { selectedMode: mode } });
//   }

//   onImageSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input?.files && input.files[0]) {
//         const file = input.files[0];
//         this.registroForm.patchValue({ foto: file }); // Aseguramos que el archivo es de tipo 'File'
//     } else {
//         this.registroForm.patchValue({ foto: null });
//         console.error('No se seleccionó un archivo válido');
//     }
// }

// uploadImage(file: File): Promise<any> {
//     const formData = new FormData();
//     const token = localStorage.getItem('authToken');

//     if (!token) {
//         alert('Por favor, inicia sesión primero.');
//         this.router.navigate(['/inicio-sesion']);
//         return Promise.reject('Token no encontrado');
//     }

//     formData.append('photo', file); // Asegúrate de que el archivo es de tipo 'File'
//     formData.append('token', token);

//     return this.http.post('http://localhost:8080/api/administration/management/image', formData).toPromise();
// }

// onSubmit(): void {
//     if (this.registroForm.invalid) {
//         alert('Por favor complete todos los campos.');
//         return;
//     }

//     const file = this.registroForm.get('foto')?.value;

//     if (file instanceof File) {
//         this.uploadImage(file)
//             .then(response => console.log('Imagen subida correctamente', response))
//             .catch(error => console.error('Error al subir la imagen', error));
//     } else {
//         alert('Por favor selecciona una imagen válida.');
//     }
// }


//   hasError(field: string, errorType: string): boolean {
//     const control = this.registroForm.get(field);
//     return control?.hasError(errorType) && control?.touched ? true : false;
//   }

//   validateNumberInput(event: KeyboardEvent): void {
//     const charCode = event.which ? event.which : event.keyCode;
//     if (charCode < 48 || charCode > 57) {
//       event.preventDefault();
//     }
//   }

//   preventNumberInput(event: KeyboardEvent): void {
//     const charCode = event.which ? event.which : event.keyCode;
//     if (charCode >= 48 && charCode <= 57) {
//       event.preventDefault();
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule

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
      modo: ['', Validators.required],
      identificacion: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      codigoUnico: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      unidadAcademica: ['', Validators.required],
    });
  }

  redirectTo(route: string, mode: string) {
    this.selectedMode = mode;
    this.registroForm.get('modo')?.setValue(mode);
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
      name: this.registroForm.get('nombres')?.value,
      surename: this.registroForm.get('apellidos')?.value,
      role: this.registroForm.get('modo')?.value.toUpperCase(),
      photo_id: imageId,
      other_data: [
        {
          key: 'UNIDAD ACADEMICA',
          value: this.registroForm.get('unidadAcademica')?.value,
        },
        {
          key: 'CÓDIGO ÚNICO',
          value: this.registroForm.get('codigoUnico')?.value,
        },
        {
          // key: 'CORREO INSTITUCIONAL',
          // value: `${this.registroForm.get('nombres')?.value.toLowerCase()}.${this.registroForm
          //   .get('apellidos')
          //   ?.value.toLowerCase()
          //   .split(' ')
          //   .join('')}@epn.edu.ec`,
          key: 'CORREO INSTITUCIONAL',
          value: `${this.registroForm.get('nombres')?.value.split(' ')[0].toLowerCase()}.${this.registroForm.get('apellidos')?.value.split(' ')[0].toLowerCase()}@epn.edu.ec`,

        },
      ],
    };

    this.http
      .post('http://localhost:8080/api/administration/management/person', formData)
      .subscribe({
        next: (response) => {
          console.log('Formulario enviado exitosamente', response);
          alert('Datos enviados con éxito');
        },
        error: (error) => {
          console.error('Error al enviar los datos:', error);
          alert('Error al enviar los datos.');
        },
      });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      alert('Por favor complete todos los campos.');
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
          alert('Error al subir la imagen.');
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
