import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modulo-registro-docente-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modulo-registro-docente-admin.component.html',
  styleUrls: ['./modulo-registro-docente-admin.component.css']
})
export class ModuloRegistroDocenteAdminComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { selectedMode: string };

    // Inicializa el formulario con el modo seleccionado o un valor predeterminado
    this.registroForm = this.fb.group({
      foto: ['', Validators.required],
      modo: [state?.selectedMode || '', Validators.required], // Modo seleccionado por defecto
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
          Validators.pattern(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]\s){1}[A-ZÁÉÍÓÚÑ][a-záéíóúñ]$/) // Dos nombres
        ]
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]\s){1}[A-ZÁÉÍÓÚÑ][a-záéíóúñ]$/) // Dos apellidos
        ]
      ],
      direccionAdministrativa: ['', Validators.required]
    });
  }

  // Redirige según el modo seleccionado
  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  // Enviar formulario
  onSubmit() {
    if (this.registroForm.valid) {
      console.log('Datos del formulario:', this.registroForm.value);
      // Aquí enviarías los datos al backend
    } else {
      console.log('Formulario inválido');
      this.registroForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }

  // Método para verificar errores en los campos
  hasError(field: string, errorType: string): boolean {
    const control = this.registroForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }
}