import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOptionnalTasksComponent } from './delete-optionnal-tasks.component';

describe('DeleteOptionnalTasksComponent', () => {
  let component: DeleteOptionnalTasksComponent;
  let fixture: ComponentFixture<DeleteOptionnalTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOptionnalTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOptionnalTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
