import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditarComponent } from './popup-editar.component';

describe('PopupEditarComponent', () => {
  let component: PopupEditarComponent;
  let fixture: ComponentFixture<PopupEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
