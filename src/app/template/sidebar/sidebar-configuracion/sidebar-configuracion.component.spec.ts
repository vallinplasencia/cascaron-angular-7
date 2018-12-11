import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarConfiguracionComponent } from './sidebar-configuracion.component';

describe('SidebarConfiguracionComponent', () => {
  let component: SidebarConfiguracionComponent;
  let fixture: ComponentFixture<SidebarConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
