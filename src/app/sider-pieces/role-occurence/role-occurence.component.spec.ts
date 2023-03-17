import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleOccurenceComponent } from './role-occurence.component';

describe('RoleOccurenceComponent', () => {
  let component: RoleOccurenceComponent;
  let fixture: ComponentFixture<RoleOccurenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleOccurenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleOccurenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
