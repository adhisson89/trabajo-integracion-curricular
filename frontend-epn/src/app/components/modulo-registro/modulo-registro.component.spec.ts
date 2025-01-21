import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ModuloRegistroComponent } from './modulo-registro.component';
import { of } from 'rxjs'; 

describe('ModuloRegistroComponent', () => {
  let component: ModuloRegistroComponent;
  let fixture: ComponentFixture<ModuloRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloRegistroComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModuloRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Formulario debería ser inválido si está vacío', () => {
    expect(component.registroForm.invalid).toBeTrue();
    console.log('Formulario inválido como se esperaba cuando está vacío.');
  });



  it('Debería mostrar errores de validación para "identificación"', () => {
    const identificacionControl = component.registroForm.get('identificacion');
    identificacionControl?.setValue('');
    fixture.detectChanges();

    expect(identificacionControl?.invalid).toBeTrue();
    console.log('Error de validación capturado: La identificación está vacía.');

    identificacionControl?.setValue('123');
    fixture.detectChanges();

    expect(identificacionControl?.hasError('pattern')).toBeTrue();
    console.log('Error de validación capturado: La identificación no cumple el patrón.');
  });

  it('Debería actualizar el control "modo" al redirigir', () => {
    component.redirectTo('moduloRegistro', 'estudiante');
    expect(component.selectedMode).toBe('estudiante');
    expect(component.registroForm.get('modo')?.value).toBe('estudiante');
    console.log('Modo actualizado correctamente al redirigir.');
  });

  it('Debería manejar correctamente la selección de imagen', () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onImageSelected(event);
    expect(component.registroForm.get('foto')?.value).toBe(file);
    console.log('Imagen seleccionada correctamente.');
  });

  it('Debería fallar la selección de imagen si no es válida', () => {
    const event = { target: { files: [] } } as unknown as Event;

    component.onImageSelected(event);
    expect(component.registroForm.get('foto')?.value).toBeNull();
    console.log('Seleccionar una imagen inválida establece el valor en null.');
  });

 
  


});
