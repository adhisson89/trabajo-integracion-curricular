import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRegistroDocenteAdminComponent } from './modulo-registro-docente-admin.component';

describe('ModuloRegistroDocenteAdminComponent', () => {
  let component: ModuloRegistroDocenteAdminComponent;
  let fixture: ComponentFixture<ModuloRegistroDocenteAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloRegistroDocenteAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloRegistroDocenteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
