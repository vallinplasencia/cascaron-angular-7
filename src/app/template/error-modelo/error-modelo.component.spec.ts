import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorModeloComponent } from './error-modelo.component';

describe('ErrorModeloComponent', () => {
  let component: ErrorModeloComponent;
  let fixture: ComponentFixture<ErrorModeloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorModeloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
