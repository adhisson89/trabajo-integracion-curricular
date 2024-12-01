 import { Component } from '@angular/core';
 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 import { Router } from '@angular/router';
 import { CommonModule } from '@angular/common'; // Importar CommonModule
 import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
 import { HttpHeaders } from '@angular/common/http';
 import { HttpClient } from '@angular/common/http';

 const headers = new HttpHeaders({
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${localStorage.getItem('token')}` // O donde guardes el token
 });

 
 

 @Component({
   selector: 'app-modulo-registro',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule], // Agregar los módulos necesarios
   templateUrl: './modulo-registro.component.html',
   styleUrls: ['./modulo-registro.component.css']
 })
 export class ModuloRegistroComponent {
   registroForm: FormGroup;

   // Variable para almacenar el modo seleccionado
   selectedMode: string = '';

   constructor(private fb: FormBuilder, private router: Router) {
     this.registroForm = this.fb.group({
       foto: ['', Validators.required],
       modo: ['estudiante', Validators.required], // "estudiante" seleccionado por defecto
       identificacion: [
         '',
         
         [
           Validators.required,
           Validators.pattern(/^\d{10}$/) // Solo 10 dígitos numéricos (Ecuador)
         ]
       ],
       nombres: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/) // Solo letras y espacios
        ]
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/) // Solo letras y espacios
        ]
      ],
      numeroUnico: [
        '', 
        [
          Validators.required, 
          Validators.pattern(/^\d{9}$/) // Solo 9 dígitos numéricos
        ]
      ],
       unidadAcademica: ['', Validators.required]
     });

     // Inicializa el modo seleccionado como "estudiante"
     this.selectedMode = 'estudiante';
   }


   // Redirige al componente adecuado según el modo seleccionado
   redirectTo(route: string, mode: string) {
     this.selectedMode = mode;
     this.registroForm.get('modo')?.setValue(mode); // Actualiza el valor en el formulario
     this.router.navigate([route], { state: { selectedMode: mode } }); // Envía el modo como estado
   }


  onSubmit() {
    if (this.registroForm.valid) {
      const formData = this.registroForm.value;
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzBlZDg1YTI0ZDVhOGVhMDJlZjM1NyIsImVtYWlsIjoiYWRoaXNzb24uY2VkZW5vQGVwbi5lZHUuZWMiLCJmdWxsbmFtZSI6IkFkaGlzc29uIENlZGXDsW8iLCJpYXQiOjE3MzEyNzk0NTUsImV4cCI6MTczMTI4NjY1NX0.t_fN7PV12Or92FHzndhby74otPmuRoi5jzStUD0XtXQ';
  
      fetch('http://localhost:8080/api/administration/management/person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token aquí
        },
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Respuesta del servidor:', data);
          alert('Registro exitoso');
          this.router.navigate(['/moduloRegistro']);
        })
        .catch(error => {
          console.error('Error en la petición:', error);
          alert('Ocurrió un error al enviar los datos. Inténtelo nuevamente.');
        });
    } else {
      console.log('Formulario inválido');
      this.registroForm.markAllAsTouched();
    }
  }
  
  

   // Métodos auxiliares para simplificar validaciones en el HTML
   hasError(field: string, errorType: string): boolean {
     const control = this.registroForm.get(field);
     return control?.hasError(errorType) && control?.touched ? true : false;
   }

   validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Evita que se ingrese un carácter no numérico
    }
  }

  preventNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) { // Números ASCII (0-9)
      event.preventDefault(); // Evita el ingreso
    }
  }
  
  
 }