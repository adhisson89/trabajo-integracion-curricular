import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Item {
  other_data: any;
  identification: string;
  name: string;
  surename: string;
  role: string;
  modo: string;
}

@Component({
  selector: 'app-modulo-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modulo-listado.component.html',
  styleUrls: ['./modulo-listado.component.css'],
})
export class ModuloListadoComponent implements OnInit {



  filterIdentification: string = '';
  item: any;
  items: Item[] = [];
  filteredItems: Item[] = [...this.items];
  editingItem: Item | null = null;
  editForm: FormGroup;
  isLoading: boolean = true;
  showDeleteConfirmation: boolean = false;
  itemToDelete: Item | null = null;
  token: string | null = localStorage.getItem('authToken');
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      foto: [''],
      identificacion: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      codigoUnico: [''],
      unidadAcademica: [''],
      direccionAdministrativa: [''],
      modo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    this.isLoading = true;
    const token = localStorage.getItem('authToken');

    fetch('http://localhost:8080/api/administration/management/people/' + token, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        this.items = data;
        this.filteredItems = [...this.items];
        this.isLoading = false;
      })
      .catch(error => {
        console.error(error);
        this.isLoading = false;
      });
  }

  confirmDelete(item: Item) {
    this.showDeleteConfirmation = true;
    this.itemToDelete = item;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.itemToDelete = null;
  }

  deleteItem() {
    if (this.itemToDelete) {
      const token = localStorage.getItem('authToken');
      fetch('http://localhost:8080/api/administration/management/person', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          identification: this.itemToDelete.identification,
        }),
      })
        .then(response => {
          if (response.ok) {
            this.filteredItems = this.filteredItems.filter(
              item => item !== this.itemToDelete
            );
            this.items = this.items.filter(item => item !== this.itemToDelete);
            alert('El registro ha sido eliminado con éxito');
          } else {
            throw new Error('Error al eliminar el registro');
          }
        })
        .catch(error => {
          console.error(error);
          alert('No se pudo eliminar el registro');
        })
        .finally(() => {
          this.showDeleteConfirmation = false;
          this.itemToDelete = null;
        });
    }
  }


  startEdit(item: Item) {
    this.editingItem = item;

    // Extraer valores de `other_data`

    const unidadAcademica = item.other_data?.find((data: { key: string; }) => data.key === 'UNIDAD ACADEMICA')?.value || '';
    const codigoUnico = item.other_data?.find((data: { key: string; }) => data.key === 'CÓDIGO ÚNICO')?.value || '';
    const correoInstitucional = item.other_data?.find((data: { key: string; }) => data.key === 'CORREO INSTITUCIONAL')?.value || '';

    // Configurar valores del formulario
    this.editForm.patchValue({
      identificacion: item.identification,
      nombres: item.name,
      apellidos: item.surename,
      codigoUnico: codigoUnico,
      unidadAcademica: unidadAcademica,
      direccionAdministrativa: '', // Si aplicara en otro contexto
      modo: item.role.toLowerCase(), // Usar `role` como `modo`
    });
  }

  cancelEdit() {
    this.editingItem = null;
    this.editForm.reset();
  }


  // Método para manejar el archivo seleccionado
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Guardar el archivo seleccionado
    } else {
      this.selectedFile = null; // Si no se selecciona un archivo, limpiar la variable
    }
  }





  onSubmit() {
    if (this.editingItem) {
      const rawPayload = {
        token: this.token,
        role: this.editingItem.role.toUpperCase(),
        nombres: this.editingItem.name,
      apellidos:  this.editingItem.surename,
        other_data: [
          {
            key: 'UNIDAD ACADEMICA',
            value: this.editForm.value.unidadAcademica || '',
          },
          {
            key: 'CÓDIGO ÚNICO',
            value: this.editForm.value.codigoUnico || '',
          },
          {
            key: 'CORREO INSTITUCIONAL',
            value: `${this.editForm.value.nombres.toLowerCase()}.${this.editForm.value.apellidos.toLowerCase()}@epn.edu.ec`,
          },
        ],
      };

      fetch(`http://localhost:8080/api/administration/management/person/${this.editForm.value.identificacion}`, {
        method: 'PATCH',
        headers: {
         // 'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rawPayload),
      })
        .then(response => {
          if (response.ok) {
            alert('Información actualizada con éxito');
            this.fetchItems();
            this.cancelEdit();
          }
          return response; 
        })
        .catch(error => {
          console.error(error);
          alert('No se pudo actualizar la información');
        });
    }
  }

  //filter 
  filterByIdentification() {
    if (this.filterIdentification.trim()) {
      const token = localStorage.getItem('authToken');

      fetch(`http://localhost:8080/api/administration/management/person/${token}/${this.filterIdentification}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se encontró el registro con esa identificación');
          }
          return response.json();
        })
        .then(data => {
          // Si el servidor devuelve un objeto, lo ponemos como un único ítem
          this.filteredItems = [data];
        })
        .catch(error => {
          console.error(error);
          alert('No se encontró el registro');
          this.filteredItems = []; // Limpia la lista si no se encuentra nada
        });
    } else {
      alert('Por favor, ingrese una identificación válida.');
    }
  }



}      