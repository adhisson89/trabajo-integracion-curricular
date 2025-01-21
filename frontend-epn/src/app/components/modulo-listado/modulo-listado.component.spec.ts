import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { ModuloListadoComponent } from './modulo-listado.component';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

interface Item {
  identification: string;
  name: string;
  surename: string;
  role: string;
  modo: string;
  photo_id: string;
  other_data: any;
}

describe('ModuloListadoComponent', () => {
  let component: ModuloListadoComponent;
  let fixture: ComponentFixture<ModuloListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloListadoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModuloListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component and fetch items', () => {
    const spy = spyOn(component, 'fetchItems').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    console.log('inicializacion del componente con los items');
  });

  it('should fetch items correctly', () => {
    const mockItems = [
      { other_data: null, identification: '123', name: 'John', surename: 'Doe', role: 'ESTUDIANTE', modo: 'ESTUDIANTE', photo_id: 'photo123' },
    ];
    spyOn(component['managementService'], 'getPeople').and.returnValue(of(mockItems));

    component.fetchItems();

    expect(component.items.length).toBe(1);
    console.log('items cargados correctamente');
  });



  it('should set itemToDelete and show delete confirmation', () => {
    const itemToDelete = { identification: '123', name: 'John', surename: 'Doe', role: 'ESTUDIANTE', modo: 'ESTUDIANTE', photo_id: 'photo123', other_data: null };

    component.confirmDelete(itemToDelete);

    expect(component.showDeleteConfirmation).toBe(true);
    expect(component.itemToDelete).toEqual(itemToDelete);
    console.log('confirmacion de eliminacion');
  });

  it('should handle file selection correctly', () => {
    const mockFile = new File([''], 'photo.jpg');
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(mockFile);
    console.log('seleccion de archivo');
  });

  it('should disable fields when role is ESTUDIANTE', () => {
    component.onRoleChange('ESTUDIANTE');

    expect(component.editForm.get('direccionAdministrativa')?.disabled).toBe(true);
    expect(component.editForm.get('carrera')?.enabled).toBe(true);
    expect(component.editForm.get('codigoUnico')?.enabled).toBe(true);
    console.log('deshabilitacion de campos');
  });


  it('should delete an item and show success alert', () => {
    const itemToDelete = { identification: '123', name: 'John', surename: 'Doe', role: 'ESTUDIANTE', modo: 'ESTUDIANTE', photo_id: 'photo123', other_data: null };
    component.itemToDelete = itemToDelete;
    spyOn(component['managementService'], 'deletePerson').and.returnValue(of(null));
    const swalSpy = spyOn(Swal, 'fire').and.callThrough();

    component.deleteItem();


    expect(component.items.length).toBe(0);
    console.log('eliminacion de item');
  });


  it('should fill the form with the selected item data on edit', () => {
    const itemToEdit = {
      identification: '123',
      name: 'John',
      surename: 'Doe',
      role: 'Admin',
      modo: 'Active',
      photo_id: 'photo123',
      other_data: [
        { key: 'CARRERA/PROGRAMA', value: 'Computer Science' },
        { key: 'DIRECCION ADMINISTRATIVA', value: 'Admin Office' },
      ],
    };

    component.startEdit(itemToEdit);

    expect(component.editForm.value.name).toBe('John');
    expect(component.editForm.value.surename).toBe('Doe');
    expect(component.editForm.value.role).toBe('Admin');
    expect(component.editForm.value.carrera).toBe('Computer Science');
    expect(component.editForm.value.direccionAdministrativa).toBe('Admin Office');

    console.log('llenado de formulario para editar');
  });

  it('should filter items by identification', fakeAsync(() => {
    console.log('filtrado de items por identificación exitoso');
    // Configuramos un mock para la respuesta de fetch
    const mockFilteredItem = {
      other_data: null,
      identification: '123',
      name: 'Jane',
      surename: 'Doe',
      role: 'ESTUDIANTE',
      modo: 'ESTUDIANTE',
      photo_id: 'photo123',
    };
  
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockFilteredItem),
    } as Response));
  
    // Configuramos los datos iniciales y el filtro
    component.filterIdentification = '123';
  
    // Llamamos al método
    component.filterByIdentification();
  
    // Procesamos tareas pendientes
    flushMicrotasks();
    
    // Verificamos que el filtrado funcione correctamente
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].identification).toBe('123');
    expect(component.filteredItems[0].name).toBe('Jane');
    expect(component.filteredItems[0].surename).toBe('Doe');
  
  }));
  






});
