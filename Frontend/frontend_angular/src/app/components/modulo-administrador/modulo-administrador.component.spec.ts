import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloAdministradorComponent } from './modulo-administrador.component';
import { By } from '@angular/platform-browser';


describe('ModuloAdministradorComponent', () => {
  let component: ModuloAdministradorComponent;
  let fixture: ComponentFixture<ModuloAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


//Prueba unitaria para la redirección (redirectTo)
it('should call redirectTo with correct route', () => {
  // Espiamos la función router.navigate
  spyOn(component['router'], 'navigate');
  
  // Llamamos a la función con una ruta de ejemplo
  const route = 'moduloRegistro';
  component.redirectTo(route);

  // Comprobamos si la función navigate fue llamada con la ruta esperada
  expect(component['router'].navigate).toHaveBeenCalledWith([route]);
  console.log('Prueba de redirección ejecutada. La función navigate fue llamada con la ruta: ', route);
});


//Prueba unitaria para verificar si las clases CSS están aplicadas correctamente:

it('should apply the correct CSS classes to module divs', () => {
  const moduleElements = fixture.debugElement.queryAll(By.css('.module'));
  
  // Verificamos que el número de elementos sea correcto
  expect(moduleElements.length).toBe(2);
  moduleElements.forEach((module) => {
    const classList = module.nativeElement.classList;
    expect(classList).toContain('module');
    console.log('Clase CSS "module" aplicada correctamente:', classList);
  });
});


});
