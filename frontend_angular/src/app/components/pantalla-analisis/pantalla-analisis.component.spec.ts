import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaAnalisisComponent } from './pantalla-analisis.component';

describe('PantallaAnalisisComponent', () => {
  let component: PantallaAnalisisComponent;
  let fixture: ComponentFixture<PantallaAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaAnalisisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
