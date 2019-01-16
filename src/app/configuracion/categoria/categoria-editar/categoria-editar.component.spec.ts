import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEditarComponent } from './categoria-editar.component';

describe('CategoriaEditarComponent', () => {
  let component: CategoriaEditarComponent;
  let fixture: ComponentFixture<CategoriaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
