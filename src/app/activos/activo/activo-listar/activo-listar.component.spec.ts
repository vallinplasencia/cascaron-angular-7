import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoListarComponent } from './activo-listar.component';

describe('ActivoListarComponent', () => {
  let component: ActivoListarComponent;
  let fixture: ComponentFixture<ActivoListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
