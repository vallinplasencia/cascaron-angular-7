import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoNuevoComponent } from './activo-nuevo.component';

describe('ActivoNuevoComponent', () => {
  let component: ActivoNuevoComponent;
  let fixture: ComponentFixture<ActivoNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
