import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadNuevaComponent } from './actividad-nueva.component';

describe('ActividadNuevaComponent', () => {
  let component: ActividadNuevaComponent;
  let fixture: ComponentFixture<ActividadNuevaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadNuevaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadNuevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
