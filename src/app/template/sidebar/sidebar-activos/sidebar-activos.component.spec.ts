import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarActivosComponent } from './sidebar-activos.component';

describe('SidebarActivosComponent', () => {
  let component: SidebarActivosComponent;
  let fixture: ComponentFixture<SidebarActivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarActivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
