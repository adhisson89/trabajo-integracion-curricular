import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirFotoComponent } from './subir-foto.component';

describe('SubirFotoComponent', () => {
  let component: SubirFotoComponent;
  let fixture: ComponentFixture<SubirFotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirFotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('Debería manejar correctamente la selección de imagen', () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onImageSelected(event);
    expect(component.registroForm.get('foto')?.value).toBe(file);
    console.log('FrontEnd Policia Nacional del Ecuador Imagen seleccionada correctamente.');
  });

  it('Debería fallar la selección de imagen si no es válida', () => {
    const event = { target: { files: [] } } as unknown as Event;

    component.onImageSelected(event);
    expect(component.registroForm.get('foto')?.value).toBeNull();
    console.log('FrontEnd Policia Nacional del Ecuador Seleccionar una imagen inválida establece el valor en null.');
  });
   

});
