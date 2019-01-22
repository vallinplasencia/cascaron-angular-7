import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarActividadesComponent } from './sidebar-actividades.component';

describe('SidebarActividadesComponent', () => {
  let component: SidebarActividadesComponent;
  let fixture: ComponentFixture<SidebarActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
