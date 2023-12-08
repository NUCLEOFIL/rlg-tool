import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyRoleSuccessComponent } from './copy-role-success.component';

describe('CopyRoleSuccessComponent', () => {
  let component: CopyRoleSuccessComponent;
  let fixture: ComponentFixture<CopyRoleSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyRoleSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyRoleSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
