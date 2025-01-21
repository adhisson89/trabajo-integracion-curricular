import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Item {
  other_data: any;
  identification: string;
  name: string;
  surename: string;
  role: string;
  modus: string;
  photo_image_id: string;
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


  redirectTo(route: string) {

    this.router.navigate([route]);
  }


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

  constructor(private fb: FormBuilder, private managementService: ManagementService, private router: Router) {
    this.editForm = this.fb.group({
      foto: [''],
      identificacion: ['', Validators.required],
      role: ['', Validators.required],
      name: ['', Validators.required],
      surename: ['', Validators.required],
      alias: [''],
      tipoDelito: [''],
      sentencia: [''],
      nombreGrupo: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)]],
      jerarquia: ['', Validators.required],
      photo_image_id: ['']
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
      alias: [''],
      tipoDelito: [''],
      sentencia: [''],
      nombreGrupo: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)]],
      jerarquia: ['', Validators.required],
      photo_image_id: [''],
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
            text: 'El registro ha sido eliminado con éxito.',
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
            confirmButtonText: 'Intentar de nuevo',
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
    const alias = item.other_data?.find((data: { key: string; }) => data.key === 'ALIAS')?.value || '';
    const sentencia = item.other_data?.find((data: { key: string; }) => data.key === 'SENTENCIA')?.value || '';
    const tipoDelito = item.other_data?.find((data: { key: string; }) => data.key === 'TIPO DE DELITO')?.value || ''; // Extrae la tipoDelito
    const nombreGrupo = item.other_data?.find((data: { key: string; }) => data.key === 'NOMBRE DEL GRUPO/ORGANIZACION')?.value || '';
    const jerarquia = item.other_data?.find((data: { key: string; }) => data.key === 'JERARQUIA')?.value || '';

    // Configurar valores del formulario
    this.editForm.patchValue({
      identificacion: item.identification,
      name: item.name,
      surename: item.surename,
      sentencia: sentencia,
      alias: alias,
      tipoDelito: tipoDelito, // Asigna la tipoDelito al formulario
      nombreGrupo: nombreGrupo, // Si aplicara en otro contexto ver
      jerarquia: jerarquia,
      role: item.role, // Usar `role` como `modus`
      photo_image_id: item.photo_image_id

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
      this.editForm.patchValue({ nombreGrupo: '' });//ver
      this.editForm.get('nombreGrupo')?.disable();//ver

      // Limpiar campos no relacionados con individual
      this.editForm.patchValue({ jerarquia: '' });//ver
      this.editForm.get('jerarquia')?.disable();//ver


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
      this.editForm.get('nombreGrupo')?.enable();//ver

      // Habilitar campos relacionados con roles diferentes a individual
      this.editForm.get('jerarquia')?.enable();//ver

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
        nombreGrupo: this.editForm.value.nombreGrupo,//ver
        other_data: [
          { key: 'ALIAS', value: this.editForm.value.alias || '' },
          { key: 'TIPO DE DELITO', value: this.editForm.value.tipoDelito || '' },
          { key: 'SENTENCIA', value: this.editForm.value.sentencia || '' },
          { key: 'NOMBRE DEL GRUPO/ORGANIZACION', value: this.editForm.value.nombreGrupo || '' },
          { key: 'JERARQUIA', value: this.editForm.value.jerarquia || '' },
        ],
      };

      this.managementService.updatePerson(this.editForm.value.identificacion, payload, token).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Información actualizada con éxito',
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
            confirmButtonText: 'Intentar de nuevo',
          });

        }
      });

      if (this.selectedFile) {
        this.managementService.uploadImage(this.selectedFile, this.editForm.value.photo_image_id, token).subscribe({
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
          icon: 'warning',
          confirmButtonText: 'Intentar de nuevo',
        });

        this.filteredItems = []; // Limpia la lista si no se encuentra nada
      });
  }




}      