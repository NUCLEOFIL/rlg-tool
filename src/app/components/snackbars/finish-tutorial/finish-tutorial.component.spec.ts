import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTutorialComponent } from './finish-tutorial.component';

describe('FinishTutorialComponent', () => {
  let component: FinishTutorialComponent;
  let fixture: ComponentFixture<FinishTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishTutorialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
