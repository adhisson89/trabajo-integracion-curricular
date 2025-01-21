import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InicioComponent } from './inicio.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
      schemas: [NO_ERRORS_SCHEMA], // Ignora componentes secundarios
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "inicioSesion" when admin button is clicked', () => {
    const adminButton = fixture.debugElement.query(By.css('.btn_Admin'));
    console.log('FrontEnd Policia Nacional del Ecuador Botón de Admin encontrado, simulando click...');
    adminButton.triggerEventHandler('click', null);
    console.log('FrontEnd Policia Nacional del Ecuador Evento de click ejecutado, verificando navegación...');
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicioSesion']);
    console.log('FrontEnd Policia Nacional del Ecuador Navegación a "inicioSesion" verificada exitosamente.');
  });
  
  it('should navigate to "pantallaAnalisis" when start button is clicked', () => {
    const startButton = fixture.debugElement.query(By.css('.btn_EnVivo'));
    console.log('FrontEnd Policia Nacional del Ecuador Botón de En Vivo encontrado, simulando click...');
    startButton.triggerEventHandler('click', null);
    console.log('FrontEnd Policia Nacional del Ecuador Evento de click ejecutado, verificando navegación...');
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['pantallaAnalisis']);
    console.log('FrontEnd Policia Nacional del Ecuador Navegación a "pantallaAnalisis" verificada exitosamente.');
  });

    
  it('should navigate to "subirFoto" when start button is clicked', () => {
    const startButton = fixture.debugElement.query(By.css('.btn_subir'));
    console.log('FrontEnd Policia Nacional del Ecuador Botón de Subir Foto encontrado, simulando click...');
    startButton.triggerEventHandler('click', null);
    console.log('FrontEnd Policia Nacional del Ecuador Evento de click ejecutado, verificando navegación...');
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['subirFoto']);
    console.log('FrontEnd Policia Nacional del Ecuador Navegación a "subirFoto" verificada exitosamente.');
  });


});
