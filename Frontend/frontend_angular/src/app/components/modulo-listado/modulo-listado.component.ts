import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modulo-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modulo-listado.component.html',
  styleUrls: ['./modulo-listado.component.css'],
})
export class ModuloListadoComponent {
  items = [
    { id: 1, nombre: 'Usuario 1', modo: 'estudiante' },
    { id: 2, nombre: 'Usuario 2', modo: 'administrativo' },
    { id: 3, nombre: 'Usuario 3', modo: 'docente' },
  ];

  filteredItems = [...this.items];
  editingItem: any = null;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      foto: ['', Validators.required], // Común para todos los roles
      nombres: ['', Validators.required], // Común para todos los roles
      apellidos: ['', Validators.required], // Común para todos los roles
      unidadAcademica: [''], // Solo para estudiantes
      direccionAdministrativa: [''], // Solo para administrativos
    });
  }

  filterItems(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    this.filteredItems =
      filterValue === 'all'
        ? [...this.items]
        : this.items.filter((item) => item.modo === filterValue);
  }

  startEdit(item: any, index: number) {
    this.editingItem = item;

    // Limpiar el formulario antes de llenarlo
    this.editForm.reset();

    // Configurar campos dinámicamente según el modo
    if (item.modo === 'estudiante') {
      this.editForm.get('unidadAcademica')?.setValidators(Validators.required);
      this.editForm.get('direccionAdministrativa')?.clearValidators();
    } else if (item.modo === 'administrativo') {
      this.editForm.get('direccionAdministrativa')?.setValidators(Validators.required);
      this.editForm.get('unidadAcademica')?.clearValidators();
    }

    // Actualizar las validaciones
    this.editForm.get('unidadAcademica')?.updateValueAndValidity();
    this.editForm.get('direccionAdministrativa')?.updateValueAndValidity();

    // Prellenar los datos del formulario
    this.editForm.patchValue({
      foto: '', // No hay dato cargado para la foto en este ejemplo
      nombres: item.nombre.split(' ')[0] || '',
      apellidos: item.nombre.split(' ')[1] || '',
      unidadAcademica: item.modo === 'estudiante' ? item.unidadAcademica || '' : '',
      direccionAdministrativa: item.modo === 'administrativo' ? item.direccionAdministrativa || '' : '',
    });

    console.log('Editando el ítem con índice:', index);
  }



  cancelEdit() {
    this.editingItem = null;
    this.editForm.reset();
  }

  onSubmit() {
    if (this.editForm.valid) {
      console.log('Datos guardados:', this.editForm.value);
      this.cancelEdit();
    } else {
      console.log('Formulario inválido');
      this.editForm.markAllAsTouched();
    }
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.editForm.get(field);
    return control?.hasError(errorType) && control?.touched ? true : false;
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.filteredItems = [...this.items];
  }
}