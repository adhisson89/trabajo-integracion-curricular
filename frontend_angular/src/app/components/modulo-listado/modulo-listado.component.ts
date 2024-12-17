import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { HttpClientModule } from '@angular/common/http';

interface Item {
  other_data: any;
  identification: string;
  name: string;
  surename: string;
  role: string;
  modus: string;
  photo_id: string;
}

@Component({
  selector: 'app-modulo-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './modulo-listado.component.html',
  styleUrls: ['./modulo-listado.component.css'],
  providers: [ManagementService]
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

  constructor(private fb: FormBuilder, private managementService: ManagementService) {
    this.editForm = this.fb.group({
      foto: [''],
      identificacion: ['', Validators.required],
      role: ['', Validators.required],
      name: ['', Validators.required],
      surename: ['', Validators.required],
      alias: [''],
      tipoDelito: [''],
      sentencia: [''],
      direccionAdministrativa: [''],//ver
      photo_id: ['']
    });
  }
  ngOnInit(): void {
    this.fetchItems();
    // Inicializar formulario reactivo
    this.editForm = this.fb.group({
      identificacion: ['', Validators.required],
      name: ['', Validators.required],
      surename: ['', Validators.required],
      role: ['', Validators.required],
      codigoUnico: [''],
      alias: [''],
      tipoDelito: [''],
      sentencia: [''],
      direccionAdministrativa: [''],//ver
      photo_id: [''],
    });
  
    // Escuchar cambios en el campo "modus" para gestionar dinámicamente los campos
    this.editForm.get('rol')?.valueChanges.subscribe((modus: string) => {
      this.onRoleChange(modus);
    });
  }
 

  fetchItems() {
    const token = localStorage.getItem('authToken') || '';
    this.isLoading = true;
  
    this.managementService.getPeople(token).subscribe({
      next: (data) => {
        console.log(data);
        this.items = data;
        this.filteredItems = [...this.items];
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  /* fetchItems() {
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
        console.log(data);
        this.items = data;
        this.filteredItems = [...this.items];
        this.isLoading = false;
      })
      .catch(error => {
        console.error(error);
        this.isLoading = false;
      });
  } */

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
      const token = localStorage.getItem('authToken') || '';
      this.managementService.deletePerson(token, this.itemToDelete.identification).subscribe({
        next: () => {
          this.filteredItems = this.filteredItems.filter(item => item !== this.itemToDelete);
          this.items = this.items.filter(item => item !== this.itemToDelete);
          alert('El registro ha sido eliminado con éxito');
        },
        error: (error) => {
          console.error(error);
          alert('No se pudo eliminar el registro');
        },
        complete: () => {
          this.showDeleteConfirmation = false;
          this.itemToDelete = null;
        }
      });
    }
  }

  /* deleteItem() {
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
  } */


  startEdit(item: Item) {
    this.editingItem = item;
    // Extraer valores de `other_data`
    const alias = item.other_data?.find((data: { key: string; }) => data.key === 'ALIAS')?.value || '';
    const sentencia = item.other_data?.find((data: { key: string; }) => data.key === 'SENTENCIA')?.value || '';
    const tipoDelito = item.other_data?.find((data: { key: string; }) => data.key === 'TIPO DE DELITO')?.value || ''; // Extrae la tipoDelito
    const direccionAdministrativa = item.other_data?.find((data: { key: string; }) => data.key === 'DIRECCION ADMINISTRATIVA')?.value || ''; // Extrae la tipoDelito ver

    // Configurar valores del formulario
    this.editForm.patchValue({
      identificacion: item.identification,
      name: item.name,
      surename: item.surename,
      sentencia:sentencia,
      alias: alias,
      tipoDelito: tipoDelito, // Asigna la tipoDelito al formulario
      direccionAdministrativa: direccionAdministrativa, // Si aplicara en otro contexto ver
      role: item.role, // Usar `role` como `modus`
      photo_id: item.photo_id
      
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
    console.log(this.selectedFile);
  }

  // Metodo para quitar la imagen cargada
  removeFile(): void {
    this.selectedFile = null;
    const input = document.getElementById('foto') as HTMLInputElement;
    if (input) {
      input.value = ''; // Resetea el valor del campo de archivo
    }
  }
  
  onRoleChange(modus: string): void {
    if (modus === 'INDIVIDUAL') {
      // Limpiar campos no relacionados con individual
      this.editForm.patchValue({ direccionAdministrativa: '' });//ver
      this.editForm.get('direccionAdministrativa')?.disable();//ver
  
      // Habilitar campos relacionados con individual
      this.editForm.get('sentencia')?.enable();
      this.editForm.get('alias')?.enable();
      this.editForm.get('tipoDelito')?.enable();
    } else {
      // Limpiar campos no relacionados con roles diferentes a individual
      this.editForm.patchValue({ sentencia: '', alias: '', tipoDelito: '' });
      this.editForm.get('sentencia')?.disable();
      this.editForm.get('alias')?.disable();
      this.editForm.get('tipoDelito')?.disable();
  
      // Habilitar campos relacionados con roles diferentes a individual
      this.editForm.get('direccionAdministrativa')?.enable();//ver
    }
  }

  onSubmit() {
    if (this.editingItem) {
      const token = this.token || '';
      const payload = {
        token: token,
        role: this.editForm.value.role,
        name: this.editForm.value.name,
        surename: this.editForm.value.surename,
        direccionAdministrativa: this.editForm.value.direccionAdministrativa,//ver
        other_data: [
          { key: 'ALIAS', value: this.editForm.value.alias || '' },
          { key: 'TIPO DE DELITO', value: this.editForm.value.tipoDelito || '' },
          { key: 'SENTENCIA', value: this.editForm.value.sentencia || '' },    
          { key: 'DIRECCION ADMINISTRATIVA', value: this.editForm.value.direccionAdministrativa || '' },
        ],
      };
  
      this.managementService.updatePerson(this.editForm.value.identificacion, payload, token).subscribe({
        next: () => {
          alert('Información actualizada con éxito');
          this.fetchItems();
          this.cancelEdit();
        },
        error: (error) => {
          console.error(error);
          alert('No se pudo actualizar la información');
        }
      });
  
      if (this.selectedFile) {
        this.managementService.uploadImage(this.selectedFile, this.editForm.value.photo_id, token).subscribe({
          next: () => console.log('Imagen subida con éxito'),
          error: (error) => console.error('Error al subir la imagen', error)
        });
      }
    }
  }


 /*  onSubmit() {
    if (this.editingItem) {
      const rawPayload = {
        token: this.token,
        role: this.editForm.value.role, // Use editForm values
        name: this.editForm.value.name, // Use editForm values
        surename: this.editForm.value.surename, // Use editForm values
        direccionAdministrativa: this.editForm.value.direccionAdministrativa, 
        other_data: [
          {
            key: 'ALIAS',
            value: this.editForm.value.alias || '',
          },
          {
            key: 'CÓDIGO ÚNICO',
            value: this.editForm.value.codigoUnico || '',
          },
          {
            key: 'TIPO DE DELITO',
            value: this.editForm.value.tipoDelito || '',
          },
          {
            key: 'CORREO INSTITUCIONAL',
            value: `${this.editForm.value.name.toLowerCase()}.${this.editForm.value.surename.toLowerCase()}@epn.edu.ec`,
          },
          {
            key: 'DIRECCION ADMINISTRATIVA',
            value: this.editForm.value.direccionAdministrativa || '',
          },
        ],
      };
  
      fetch(`http://localhost:8080/api/administration/management/person/${this.editForm.value.identificacion}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.token}`,
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

        if (this.selectedFile != null) {
          const token = this.token || '';
          const formData = new FormData();
          formData.append('photo', this.selectedFile); // Cambiar 'photo' a 'image' para coincidir con Postman
          formData.append('id', this.editForm.value.photo_id); // Agregar el campo 'id'
          formData.append('token', token); // Agregar el campo 'token'
          console.log(formData)
          fetch('http://localhost:8080/api/administration/management/image', { // Cambiar el endpoint
            method: 'PATCH', // Cambiar el método a PATCH
            body: formData,
          })
            .then(response => {
              if (response.ok) {
                alert('Foto actualizada con éxito');
              } else {
                alert('Error al actualizar la foto');
              }
              return response;
            })
            .catch(error => {
              console.error(error);
              alert('No se pudo actualizar la foto');
            });
        }        
    }
    console.log('Valores del formulario:', this.editForm.value);
  } */
  

  //filtrado por ci/
  filterByIdentification() {
    if (!this.filterIdentification.trim()) {
      // Si el campo de búsqueda está vacío, mostrar todos los elementos
      this.filteredItems = [...this.items];
      return;
    }
  
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
        alert('No se encontró el registro con esa Cédula/Pasaporte');
        this.filteredItems = []; // Limpia la lista si no se encuentra nada
      });
  }
  



}      