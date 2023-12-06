import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleNameDuplicateComponent } from './role-name-duplicate.component';

describe('RoleNameDuplicateComponent', () => {
  let component: RoleNameDuplicateComponent;
  let fixture: ComponentFixture<RoleNameDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleNameDuplicateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleNameDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
