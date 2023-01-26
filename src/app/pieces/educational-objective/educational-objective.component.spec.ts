import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalObjectiveComponent } from './educational-objective.component';

describe('EducationalObjectiveComponent', () => {
  let component: EducationalObjectiveComponent;
  let fixture: ComponentFixture<EducationalObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalObjectiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
