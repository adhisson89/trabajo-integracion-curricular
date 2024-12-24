import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloListadoComponent } from './modulo-listado.component';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

interface Item {
  identification: string;
  name: string;
  surename: string;
  role: string;
  modus: string;
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
  });

  it('should fetch items correctly', () => {
    const mockItems = [
      { other_data: null, identification: '123', name: 'John', surename: 'Doe', role: 'Admin', modus: 'Active', photo_id: 'photo123' },
    ];
    spyOn(component['managementService'], 'getPeople').and.returnValue(of(mockItems));

    component.fetchItems();

    expect(component.items.length).toBe(1);
  
  });

  it('should fill the form with the selected item data on edit', () => {
    const itemToEdit = {
      identification: '123',
      name: 'John',
      surename: 'Doe',
      role: 'Admin',
      modus: 'Active',
      photo_id: 'photo123',
      other_data: [
        { key: 'ALIAS', value: 'JDoe' },
        { key: 'SENTENCIA', value: '10 years' },
        { key: 'TIPO DE DELITO', value: 'Theft' },
        { key: 'NOMBRE DEL GRUPO/ORGANIZACION', value: 'Bandits' },
        { key: 'JERARQUIA', value: 'Leader' },
      ],
    };

    component.startEdit(itemToEdit);

    expect(component.editForm.value.name).toBe('John');
    expect(component.editForm.value.surename).toBe('Doe');
    expect(component.editForm.value.role).toBe('Admin');
    expect(component.editForm.value.alias).toBe('JDoe');
  });

  it('should set itemToDelete and show delete confirmation', () => {
    const itemToDelete = { identification: '123', name: 'John', surename: 'Doe', role: 'Admin', modus: 'Active', photo_id: 'photo123', other_data: null };

    component.confirmDelete(itemToDelete);

    expect(component.showDeleteConfirmation).toBe(true);
    expect(component.itemToDelete).toEqual(itemToDelete);
  });

  it('should handle file selection correctly', () => {
    const mockFile = new File([''], 'photo.jpg');
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(mockFile);
  });

  it('should disable fields when role is INDIVIDUAL', () => {
    component.onRoleChange('INDIVIDUAL');

    expect(component.editForm.get('nombreGrupo')?.disabled).toBe(true);
    expect(component.editForm.get('jerarquia')?.disabled).toBe(true);
    expect(component.editForm.get('sentencia')?.enabled).toBe(true);
  });


  it('should delete an item and show success alert', () => {
    const itemToDelete = { identification: '123', name: 'John', surename: 'Doe', role: 'Admin', modus: 'Active', photo_id: 'photo123', other_data: null };
    component.itemToDelete = itemToDelete;
    spyOn(component['managementService'], 'deletePerson').and.returnValue(of(null));
    const swalSpy = spyOn(Swal, 'fire').and.callThrough();

    component.deleteItem();

    
    expect(component.items.length).toBe(0);
    
  });



  
});
