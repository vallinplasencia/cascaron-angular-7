import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisActividadesAsignadasListarComponent } from './mis-actividades-asignadas-listar.component';

describe('MisActividadesAsignadasListarComponent', () => {
  let component: MisActividadesAsignadasListarComponent;
  let fixture: ComponentFixture<MisActividadesAsignadasListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisActividadesAsignadasListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisActividadesAsignadasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
