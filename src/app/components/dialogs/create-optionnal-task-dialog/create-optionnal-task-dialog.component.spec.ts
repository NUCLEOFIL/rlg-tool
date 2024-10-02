import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOptionnalTaskDialogComponent } from './create-optionnal-task-dialog.component';

describe('CreateOptionnalTaskDialogComponent', () => {
  let component: CreateOptionnalTaskDialogComponent;
  let fixture: ComponentFixture<CreateOptionnalTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOptionnalTaskDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOptionnalTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
