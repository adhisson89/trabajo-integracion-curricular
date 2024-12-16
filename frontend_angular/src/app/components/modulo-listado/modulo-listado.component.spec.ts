import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloListadoComponent } from './modulo-listado.component';

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
});
