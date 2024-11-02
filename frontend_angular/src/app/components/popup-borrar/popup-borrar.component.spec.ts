import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupBorrarComponent } from './popup-borrar.component';

describe('PopupBorrarComponent', () => {
  let component: PopupBorrarComponent;
  let fixture: ComponentFixture<PopupBorrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupBorrarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupBorrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
