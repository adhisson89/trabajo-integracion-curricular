import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSesionComponent } from './inicio-sesion.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('InicioSesionComponent', () => {
  let component: InicioSesionComponent;
  let fixture: ComponentFixture<InicioSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioSesionComponent],
        providers: [
      { provide: Router, useValue: { navigate: jasmine.createSpy() } }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //Prueba para verificar la validez del formulario:
  it('should create a form with empty username and password', () => {
    console.log('FrontEnd Policia Nacional del Ecuador Verificando que el formulario esté creado con los campos vacíos...');
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('username')?.valid).toBeFalsy();
    expect(component.loginForm.get('password')?.valid).toBeFalsy();
  });
  
  it('should make the form valid when username and password are filled', () => {
    console.log('FrontEnd Policia Nacional del Ecuador Verificando que el formulario se valide cuando los campos estén completos...');
    component.loginForm.controls['username'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

//Prueba para verificar el comportamiento de onSubmit cuando el formulario es válido:
it('should call onSubmit and make a POST request when the form is valid', async () => {
  console.log('FrontEnd Policia Nacional del Ecuador Verificando que el método onSubmit se llama cuando el formulario es válido...');
  const formValue = { username: 'user@example.com', password: 'password123' };
  component.loginForm.setValue(formValue);
  const spy = spyOn(component, 'onSubmit').and.callThrough();
  // Mock de `fetch` con la estructura completa de `Response`
  const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(
    JSON.stringify({ token: 'fake-token' }), // Cuerpo de la respuesta
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )));

  await component.onSubmit();
  expect(spy).toHaveBeenCalled();
  expect(fetchSpy).toHaveBeenCalledWith(
    'http://localhost:8080/api/administration/auth/login',
    jasmine.objectContaining({
      method: 'POST',
      headers: jasmine.objectContaining({ 'Content-Type': 'application/json' }),
      body: jasmine.any(String),
    })
  );
  console.log('FrontEnd Policia Nacional del Ecuador onSubmit llamada exitosamente, solicitud POST realizada.');
})


});
