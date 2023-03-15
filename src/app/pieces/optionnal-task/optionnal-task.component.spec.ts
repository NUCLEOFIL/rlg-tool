import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionnalTaskComponent } from './optionnal-task.component';

describe('OptionnalTaskComponent', () => {
  let component: OptionnalTaskComponent;
  let fixture: ComponentFixture<OptionnalTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionnalTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionnalTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
