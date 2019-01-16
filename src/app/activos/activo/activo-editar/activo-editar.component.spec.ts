import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoEditarComponent } from './activo-editar.component';

describe('ActivoEditarComponent', () => {
  let component: ActivoEditarComponent;
  let fixture: ComponentFixture<ActivoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
