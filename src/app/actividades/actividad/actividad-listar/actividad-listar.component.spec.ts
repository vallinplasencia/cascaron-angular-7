import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadListarComponent } from './actividad-listar.component';

describe('ActividadListarComponent', () => {
  let component: ActividadListarComponent;
  let fixture: ComponentFixture<ActividadListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
