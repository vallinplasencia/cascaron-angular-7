import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisActividadesAsignadasMostrarComponent } from './mis-actividades-asignadas-mostrar.component';

describe('MisActividadesAsignadasMostrarComponent', () => {
  let component: MisActividadesAsignadasMostrarComponent;
  let fixture: ComponentFixture<MisActividadesAsignadasMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisActividadesAsignadasMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisActividadesAsignadasMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
