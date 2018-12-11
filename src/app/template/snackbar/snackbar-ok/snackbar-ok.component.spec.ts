import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarOkComponent } from './snackbar-ok.component';

describe('SnackbarOkComponent', () => {
  let component: SnackbarOkComponent;
  let fixture: ComponentFixture<SnackbarOkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarOkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarOkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
