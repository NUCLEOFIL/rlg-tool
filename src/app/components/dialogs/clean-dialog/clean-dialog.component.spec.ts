import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanDialogComponent } from './clean-dialog.component';

describe('CleanDialogComponent', () => {
  let component: CleanDialogComponent;
  let fixture: ComponentFixture<CleanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CleanDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CleanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
