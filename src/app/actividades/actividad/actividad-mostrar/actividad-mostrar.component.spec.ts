import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadMostrarComponent } from './actividad-mostrar.component';

describe('ActividadMostrarComponent', () => {
  let component: ActividadMostrarComponent;
  let fixture: ComponentFixture<ActividadMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
