import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaMostrarComponent } from './categoria-mostrar.component';

describe('CategoriaMostrarComponent', () => {
  let component: CategoriaMostrarComponent;
  let fixture: ComponentFixture<CategoriaMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
