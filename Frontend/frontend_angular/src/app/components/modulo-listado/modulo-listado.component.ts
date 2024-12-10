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
startEdit(item: Item) {

}
 

  filterIdentification: string = '';
  item: any;
  items: Item[] = [];
  filteredItems: Item[] = [...this.items];

  isLoading: boolean = true;
  showDeleteConfirmation: boolean = false;
  itemToDelete: Item | null = null;
  token: string | null = localStorage.getItem('authToken');
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado

  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  //metodo para traer los datos
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
        alert('No se encontró el registro');
        this.filteredItems = []; // Limpia la lista si no se encuentra nada
      });
  }




}      