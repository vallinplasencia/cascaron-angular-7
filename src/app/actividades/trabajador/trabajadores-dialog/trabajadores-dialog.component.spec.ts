import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadoresDialogComponent } from './trabajadores-dialog.component';

describe('TrabajadoresDialogComponent', () => {
  let component: TrabajadoresDialogComponent;
  let fixture: ComponentFixture<TrabajadoresDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrabajadoresDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajadoresDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
