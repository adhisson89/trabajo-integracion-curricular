import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PantallaAnalisisComponent } from './pantalla-analisis.component';

// Mock para el servicio Router
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('PantallaAnalisisComponent', () => {
  let component: PantallaAnalisisComponent;
  let fixture: ComponentFixture<PantallaAnalisisComponent>;
  let router: RouterStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaAnalisisComponent],
      providers: [
        { provide: Router, useClass: RouterStub } // Usa el mock de Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaAnalisisComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as RouterStub;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset inactivity timer on user activity', () => {
    console.log('Actividad del usuario detectada');
    spyOn(window, 'clearTimeout');
    spyOn(window, 'setTimeout');

    component.resetInactivityTimer();

    expect(clearTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), component['inactivityTimeLimit']);
  });

  it('should initialize videoRef on ngOnInit', async () => {
    console.log('Inicialización de videoRef en ngOnInit');
    spyOn(component, 'loadModels').and.returnValue(Promise.resolve());
    spyOn(component, 'setupCamara');

    await component.ngOnInit();

    expect(component.loadModels).toHaveBeenCalled();
    expect(component.setupCamara).toHaveBeenCalled();
    expect(component.videoRef).not.toBeNull();
  });

  it('should load face-api.js models', async () => {
    console.log('Carga de modelos de face-api.js');
    spyOn(console, 'log');
    spyOn(console, 'error');

    await component.loadModels();

    expect(console.log).toHaveBeenCalledWith('Modelos de face-api.js cargados correctamente');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should stop camera and intervals on ngOnDestroy', () => {
    console.log('Detención de cámara y temporizadores en ngOnDestroy');
    spyOn(window, 'clearTimeout');
    spyOn(window, 'clearInterval');
    const mockTrack = { stop: jasmine.createSpy('stop') };
    component.stream = { getTracks: () => [mockTrack] } as unknown as MediaStream;

    component.ngOnDestroy();

    expect(clearTimeout).toHaveBeenCalledWith(component['inactivityTimeout']);
    expect(clearInterval).toHaveBeenCalledWith(component['detectionInterval']);
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it('should send image blob to backend', async () => {
    console.log('Envío de imagen blob al backend'); 
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({ ok: true } as Response));
    spyOn(console, 'log');

    const mockBlob = new Blob();
    await component.sendToBackend(mockBlob);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/face-recognition/compare', jasmine.any(Object));
    expect(console.log).toHaveBeenCalledWith('Imagen enviada exitosamente');
  });

  it('should handle active camera state correctly', () => {
    console.log('Imagen capturada y camara activa');
    // Crear un mock de videoRef simulando la cámara activa
    const mockVideoElement = document.createElement('video');
    mockVideoElement.width = 640;
    mockVideoElement.height = 480;
    component.videoRef = mockVideoElement;
  
    // Verificar que las dimensiones de la cámara son válidas
    expect(component.videoRef.width).toBeGreaterThan(0);
    expect(component.videoRef.height).toBeGreaterThan(0);
  
    // Opcional: Simular un método como `captureImageAsJPG` que dependa del estado activo de la cámara
    spyOn(component, 'captureImageAsJPG').and.callThrough();
  
    component.captureImageAsJPG();
  
    expect(component.captureImageAsJPG).toHaveBeenCalled();
    
  });
  


  
});
