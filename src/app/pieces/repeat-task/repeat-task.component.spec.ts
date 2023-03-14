import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatTaskComponent } from './repeat-task.component';

describe('RepeatTaskComponent', () => {
  let component: RepeatTaskComponent;
  let fixture: ComponentFixture<RepeatTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
