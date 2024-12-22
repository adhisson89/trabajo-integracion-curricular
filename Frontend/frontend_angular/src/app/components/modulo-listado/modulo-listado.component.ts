import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Item {
  other_data: any;
  identification: string;
  name: string;
  surename: string;
  role: string;
  modo: string;
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
      codigoUnico: [''],
      unidadAcademica: [''],
      direccionAdministrativa: [''],
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
      unidadAcademica: [''],
      carrera: [''],
      direccionAdministrativa: [''],
      photo_id: [''],
    });
  
    // Escuchar cambios en el campo "modo" para gestionar dinámicamente los campos
    this.editForm.get('rol')?.valueChanges.subscribe((modo: string) => {
      this.onRoleChange(modo);
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

          Swal.fire({
            title: '¡Éxito!',
            text: 'El registro ha sido eliminado con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });

        
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el registro',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          
        },
        complete: () => {
          this.showDeleteConfirmation = false;
          this.itemToDelete = null;
        }
      });
    }
  }

 
  
  startEdit(item: Item) {
    this.editingItem = item;
    // Extraer valores de `other_data`
    const unidadAcademica = item.other_data?.find((data: { key: string; }) => data.key === 'UNIDAD ACADEMICA')?.value || '';
    const codigoUnico = item.other_data?.find((data: { key: string; }) => data.key === 'CÓDIGO ÚNICO')?.value || '';
    const correoInstitucional = item.other_data?.find((data: { key: string; }) => data.key === 'CORREO INSTITUCIONAL')?.value || '';
    const carrera = item.other_data?.find((data: { key: string; }) => data.key === 'CARRERA/PROGRAMA')?.value || ''; // Extrae la carrera
    const direccionAdministrativa = item.other_data?.find((data: { key: string; }) => data.key === 'DIRECCION ADMINISTRATIVA')?.value || ''; // Extrae la carrera

    // Configurar valores del formulario
    this.editForm.patchValue({
      identificacion: item.identification,
      name: item.name,
      surename: item.surename,
      codigoUnico: codigoUnico,
      unidadAcademica: unidadAcademica,
      carrera: carrera, // Asigna la carrera al formulario

      direccionAdministrativa: direccionAdministrativa, // Si aplicara en otro contexto
      role: item.role, // Usar `role` como `modo`
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
  
  onRoleChange(modo: string): void {
    if (modo === 'ESTUDIANTE') {
      // Limpiar campos no relacionados con estudiante
      this.editForm.patchValue({ direccionAdministrativa: '' });
      this.editForm.get('direccionAdministrativa')?.disable();
  
      // Habilitar campos relacionados con estudiante
      this.editForm.get('codigoUnico')?.enable();
      this.editForm.get('unidadAcademica')?.enable();
      this.editForm.get('carrera')?.enable();
    } else {
      // Limpiar campos no relacionados con roles diferentes a estudiante
      this.editForm.patchValue({ codigoUnico: '', unidadAcademica: '', carrera: '' });
      this.editForm.get('codigoUnico')?.disable();
      this.editForm.get('unidadAcademica')?.disable();
      this.editForm.get('carrera')?.disable();
  
      // Habilitar campos relacionados con roles diferentes a estudiante
      this.editForm.get('direccionAdministrativa')?.enable();
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
        direccionAdministrativa: this.editForm.value.direccionAdministrativa,
        other_data: [
          { key: 'UNIDAD ACADEMICA', value: this.editForm.value.unidadAcademica || '' },
          { key: 'CÓDIGO ÚNICO', value: this.editForm.value.codigoUnico || '' },
          { key: 'CARRERA/PROGRAMA', value: this.editForm.value.carrera || '' },
          { key: 'CORREO INSTITUCIONAL', value: `${this.editForm.value.name.toLowerCase()}.${this.editForm.value.surename.toLowerCase()}@epn.edu.ec` },
          { key: 'DIRECCION ADMINISTRATIVA', value: this.editForm.value.direccionAdministrativa || '' },
        ],
      };
  
      this.managementService.updatePerson(this.editForm.value.identificacion, payload, token).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Información actualizada con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
         
          this.fetchItems();
          this.cancelEdit();
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la información',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          

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
        Swal.fire({
          title: 'Error',
          text: 'No se encontró el registro con esa Cédula/Pasaporte',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
       
        this.filteredItems = []; // Limpia la lista si no se encuentra nada
      });
  }
  



}      