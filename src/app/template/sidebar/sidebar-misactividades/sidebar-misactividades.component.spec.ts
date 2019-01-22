import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMisactividadesComponent } from './sidebar-misactividades.component';

describe('SidebarMisactividadesComponent', () => {
  let component: SidebarMisactividadesComponent;
  let fixture: ComponentFixture<SidebarMisactividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarMisactividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMisactividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
