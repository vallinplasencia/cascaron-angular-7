import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoMostrarComponent } from './activo-mostrar.component';

describe('ActivoMostrarComponent', () => {
  let component: ActivoMostrarComponent;
  let fixture: ComponentFixture<ActivoMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
