// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

// // Define la interfaz para los ítems
// interface Item {
// role: any;
// surename: any;
// name: any;
// identification: any;
//   modo: string;
//   nombre: string;
//   unidadAcademica?: string;
//   direccionAdministrativa?: string;
//   // Agrega más propiedades según los datos que recibes
// }

// @Component({
//   selector: 'app-modulo-listado',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './modulo-listado.component.html',
//   styleUrls: ['./modulo-listado.component.css'],
// })
// export class ModuloListadoComponent implements OnInit {
//   items: Item[] = [];  // Arreglo de tipo 'Item' donde se almacenarán los datos obtenidos
//   filteredItems: Item[] = [...this.items];
//   editingItem: Item | null = null;  // Aquí también se especifica el tipo 'Item'
//   editForm: FormGroup;
//   isLoading: boolean = true;  // Variable para manejar el estado de carga
// item: any;

//   constructor(private fb: FormBuilder) {
//     this.editForm = this.fb.group({
//       foto: ['', Validators.required],
//       nombres: ['', Validators.required],
//       apellidos: ['', Validators.required],
//       unidadAcademica: [''],
//       direccionAdministrativa: [''],
//     });
//   }

//   ngOnInit(): void {
//     // Llamar a la función para obtener los datos al iniciar el componente
//     this.fetchItems();
//   }

//   fetchItems() {
//     this.isLoading = true; // Establecer como cargando
  
//     // El token de autenticación que ya tienes (este sería dinámico en un caso real)
//     const token = localStorage.getItem('authToken');
//     console.log('Token obtenido:', token); // Verifica si el token está disponible
  
//     // Realizar la petición fetch con el método GET y el token en la cabecera de autorización
//     fetch('http://localhost:8080/api/administration/management/people/' + token, {
//       method: 'GET', // Especifica el método GET
//       headers: {
//         'Authorization': `Bearer ${token}`, // Añadir el token de autorización en los headers
//         'Content-Type': 'application/json', // Especifica el tipo de contenido (JSON)
//       }
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error en la solicitud');
//         }
//         return response.json();
//       })
//       .then((data: Item[]) => {
//         console.log('Datos obtenidos:', data);  // Verifica que los datos sean correctos
//         this.items = data;
//         this.filteredItems = [...this.items];
//         console.log('Items:', this.items);  // Asegúrate de que los datos estén en la propiedad
//         this.isLoading = false;
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         this.isLoading = false; // Terminar de cargar incluso si hay error
//       });
//   }

//   filterItems(event: Event) {
//     const filterValue = (event.target as HTMLSelectElement).value;
//     this.filteredItems =
//       filterValue === 'all'
//         ? [...this.items]
//         : this.items.filter((item) => item.modo === filterValue);
//   }

//   startEdit(item: Item, index: number) {
//     this.editingItem = item; // Marca el ítem en edición
//     const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local
    
//     if (!token) {
//       console.error("Token no encontrado");
//       return;
//     }
  
//     const url = `http://localhost:8080/api/administration/management/people/${token}`;
  
//     // Realiza la solicitud para obtener los datos del ítem
//     fetch(url, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error al obtener los datos del ítem');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         // Asegúrate de que los datos contengan las propiedades necesarias
//         console.log('Datos del ítem para editar:', data);
  
//         // Prellena el formulario con los datos obtenidos
//         this.editForm.patchValue({
//           foto: '', // Esto dependerá de cómo manejas la foto
//           modo: data.modo,
//           identificacion: data.identification,
//           nombres: data.name,
//           apellidos: data.surename,
//           numeroUnico: data.numeroUnico || '',
//           unidadAcademica: data.unidadAcademica || '',
//           direccionAdministrativa: data.direccionAdministrativa || '',
//         });
  
//         // Establece validadores dinámicos según el modo
//         if (data.modo === 'estudiante') {
//           this.editForm.get('unidadAcademica')?.setValidators(Validators.required);
//           this.editForm.get('direccionAdministrativa')?.clearValidators();
//         } else if (data.modo === 'administrativo') {
//           this.editForm.get('direccionAdministrativa')?.setValidators(Validators.required);
//           this.editForm.get('unidadAcademica')?.clearValidators();
//         }
  
//         this.editForm.get('unidadAcademica')?.updateValueAndValidity();
//         this.editForm.get('direccionAdministrativa')?.updateValueAndValidity();
//       })
//       .catch((error) => {
//         console.error('Error al obtener los datos:', error);
//       });
//   }
  

//   cancelEdit() {
//     this.editingItem = null;
//     this.editForm.reset();
//   }

//   onSubmit() {
//     if (this.editForm.valid) {
//       console.log('Datos guardados:', this.editForm.value);
//       this.cancelEdit();
//     } else {
//       console.log('Formulario inválido');
//       this.editForm.markAllAsTouched();
//     }
//   }

//   hasError(field: string, errorType: string): boolean {
//     const control = this.editForm.get(field);
//     return control?.hasError(errorType) && control?.touched ? true : false;
//   }

//   deleteItem(identification: string) {
//     const token = localStorage.getItem('authToken'); // Obtén el token almacenado
  
//     if (!token) {
//       console.error("Token no encontrado");
//       return;
//     }
  
//     const url = 'http://localhost:8080/api/administration/management/person';
  
//     // Estructura del cuerpo de la solicitud
//     const payload = {
//       token: token,
//       identification: identification
//     };
  
//     // Realiza la solicitud DELETE
//     fetch(url, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error al eliminar el ítem');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Respuesta del servidor:', data);
  
//         // Elimina el ítem de la lista localmente
//         this.items = this.items.filter(item => item.identification !== identification);
//         this.filteredItems = [...this.items]; // Actualiza la lista filtrada
//       })
//       .catch((error) => {
//         console.error('Error al eliminar el ítem:', error);
//       });
//   }
  
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Item {
  identification: string;
  name: string;
  surename: string;
  role: string;
  modo: string;
}

@Component({
  selector: 'app-modulo-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modulo-listado.component.html',
  styleUrls: ['./modulo-listado.component.css'],
})
export class ModuloListadoComponent implements OnInit {
filterItems($event: Event) {
throw new Error('Method not implemented.');
}
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error al obtener los datos del ítem');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         // Asegúrate de que los datos contengan las propiedades necesarias
//         console.log('Datos del ítem para editar:', data);
//         // Prellena el formulario con los datos obtenidos
//         this.editForm.patchValue({
//           foto: '', // Esto dependerá de cómo manejas la foto
//           modo: data.modo,
//           identificacion: data.identification,
//           nombres: data.name,
//           apellidos: data.surename,
//           numeroUnico: data.numeroUnico || '',
//           unidadAcademica: data.unidadAcademica || '',
//           direccionAdministrativa: data.direccionAdministrativa || '',
//         });
//         // Establece validadores dinámicos según el modo
//         if (data.modo === 'estudiante') {
//           this.editForm.get('unidadAcademica')?.setValidators(Validators.required);
//           this.editForm.get('direccionAdministrativa')?.clearValidators();
//         } else if (data.modo === 'administrativo') {
//           this.editForm.get('direccionAdministrativa')?.setValidators(Validators.required);
//           this.editForm.get('unidadAcademica')?.clearValidators();
//         }
//         this.editForm.get('unidadAcademica')?.updateValueAndValidity();
//         this.editForm.get('direccionAdministrativa')?.updateValueAndValidity();
//       })
//       .catch((error) => {
//         console.error('Error al obtener los datos:', error);
//       });
//   }
//   cancelEdit() {
//     this.editingItem = null;
//     this.editForm.reset();
//   }
//   onSubmit() {
//     if (this.editForm.valid) {
//       console.log('Datos guardados:', this.editForm.value);
//       this.cancelEdit();
//     } else {
//       console.log('Formulario inválido');
//       this.editForm.markAllAsTouched();
//     }
//   }
//   hasError(field: string, errorType: string): boolean {
//     const control = this.editForm.get(field);
//     return control?.hasError(errorType) && control?.touched ? true : false;
//   }
//   deleteItem(identification: string) {
//     const token = localStorage.getItem('authToken'); // Obtén el token almacenado
//     if (!token) {
//       console.error("Token no encontrado");
//       return;
//     }
//     const url = 'http://localhost:8080/api/administration/management/person';
//     // Estructura del cuerpo de la solicitud
//     const payload = {
//       token: token,
//       identification: identification
//     };
//     // Realiza la solicitud DELETE
//     fetch(url, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error al eliminar el ítem');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Respuesta del servidor:', data);
//         // Elimina el ítem de la lista localmente
//         this.items = this.items.filter(item => item.identification !== identification);
//         this.filteredItems = [...this.items]; // Actualiza la lista filtrada
//       })
//       .catch((error) => {
//         console.error('Error al eliminar el ítem:', error);
//       });
//   }
// }
startEdit(_t22: Item,_t23: number) {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}
item: any;
cancelEdit() {
throw new Error('Method not implemented.');
}
  items: Item[] = [];
  filteredItems: Item[] = [...this.items];
  editingItem: Item | null = null;
  editForm: FormGroup;
  isLoading: boolean = true;
  showDeleteConfirmation: boolean = false;
  itemToDelete: Item | null = null;

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
}
