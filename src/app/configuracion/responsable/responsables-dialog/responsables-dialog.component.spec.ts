import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsablesDialogComponent } from './responsables-dialog.component';

describe('ResponsablesDialogComponent', () => {
  let component: ResponsablesDialogComponent;
  let fixture: ComponentFixture<ResponsablesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsablesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsablesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
