import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRegistroOtrosComponent } from './modulo-registro-otros.component';

describe('ModuloRegistroOtrosComponent', () => {
  let component: ModuloRegistroOtrosComponent;
  let fixture: ComponentFixture<ModuloRegistroOtrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloRegistroOtrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloRegistroOtrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
