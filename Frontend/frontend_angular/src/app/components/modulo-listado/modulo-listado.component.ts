import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Define la interfaz para los ítems
interface Item {
role: any;
surename: any;
name: any;
identification: any;
  modo: string;
  nombre: string;
  unidadAcademica?: string;
  direccionAdministrativa?: string;
  // Agrega más propiedades según los datos que recibes
}

@Component({
  selector: 'app-modulo-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modulo-listado.component.html',
  styleUrls: ['./modulo-listado.component.css'],
})
export class ModuloListadoComponent implements OnInit {
  items: Item[] = [];  // Arreglo de tipo 'Item' donde se almacenarán los datos obtenidos
  filteredItems: Item[] = [...this.items];
  editingItem: Item | null = null;  // Aquí también se especifica el tipo 'Item'
  editForm: FormGroup;
  isLoading: boolean = true;  // Variable para manejar el estado de carga

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      foto: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      unidadAcademica: [''],
      direccionAdministrativa: [''],
    });
  }

  ngOnInit(): void {
    // Llamar a la función para obtener los datos al iniciar el componente
    this.fetchItems();
  }

  fetchItems() {
    this.isLoading = true; // Establecer como cargando
  
    // El token de autenticación que ya tienes (este sería dinámico en un caso real)
    const token = localStorage.getItem('authToken');
    console.log('Token obtenido:', token); // Verifica si el token está disponible
  
    // Realizar la petición fetch con el método GET y el token en la cabecera de autorización
    fetch('http://localhost:8080/api/administration/management/people/' + token, {
      method: 'GET', // Especifica el método GET
      headers: {
        'Authorization': `Bearer ${token}`, // Añadir el token de autorización en los headers
        'Content-Type': 'application/json', // Especifica el tipo de contenido (JSON)
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then((data: Item[]) => {
        console.log('Datos obtenidos:', data);  // Verifica que los datos sean correctos
        this.items = data;
        this.filteredItems = [...this.items];
        console.log('Items:', this.items);  // Asegúrate de que los datos estén en la propiedad
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error:', error);
        this.isLoading = false; // Terminar de cargar incluso si hay error
      });
  }

  filterItems(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    this.filteredItems =
      filterValue === 'all'
        ? [...this.items]
        : this.items.filter((item) => item.modo === filterValue);
  }

  startEdit(item: Item, index: number) {
    this.editingItem = item;
    this.editForm.reset();

    if (item.modo === 'estudiante') {
      this.editForm.get('unidadAcademica')?.setValidators(Validators.required);
      this.editForm.get('direccionAdministrativa')?.clearValidators();
    } else if (item.modo === 'administrativo') {
      this.editForm.get('direccionAdministrativa')?.setValidators(Validators.required);
      this.editForm.get('unidadAcademica')?.clearValidators();
    }

    this.editForm.get('unidadAcademica')?.updateValueAndValidity();
    this.editForm.get('direccionAdministrativa')?.updateValueAndValidity();

    this.editForm.patchValue({
      foto: '',
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
