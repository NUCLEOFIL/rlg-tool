import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveOptionnalTasksComponent } from './move-optionnal-tasks.component';

describe('MoveOptionnalTasksComponent', () => {
  let component: MoveOptionnalTasksComponent;
  let fixture: ComponentFixture<MoveOptionnalTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveOptionnalTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveOptionnalTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
