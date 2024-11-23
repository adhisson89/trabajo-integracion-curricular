import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule

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
      numeroUnico: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/) // Solo números
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

  // Valida y envía el formulario
  onSubmit() {
    if (this.registroForm.valid) {
      console.log('Datos del formulario:', this.registroForm.value);
      // Aquí enviarías los datos al backend
    } else {
      console.log('Formulario inválido');
      this.registroForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }

  // Métodos auxiliares para simplificar validaciones en el HTML
  hasError(field: string, errorType: string): boolean {
    const control = this.registroForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }
}