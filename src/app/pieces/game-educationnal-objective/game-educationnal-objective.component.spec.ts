import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEducationnalObjectiveComponent } from './game-educationnal-objective.component';

describe('GameEducationnalObjectiveComponent', () => {
  let component: GameEducationnalObjectiveComponent;
  let fixture: ComponentFixture<GameEducationnalObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameEducationnalObjectiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEducationnalObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
