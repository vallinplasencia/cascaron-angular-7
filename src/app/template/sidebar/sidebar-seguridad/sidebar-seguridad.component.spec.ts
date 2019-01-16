import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSeguridadComponent } from './sidebar-seguridad.component';

describe('SidebarSeguridadComponent', () => {
  let component: SidebarSeguridadComponent;
  let fixture: ComponentFixture<SidebarSeguridadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarSeguridadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
