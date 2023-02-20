import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomEventComponent } from './random-event.component';

describe('RandomEventComponent', () => {
  let component: RandomEventComponent;
  let fixture: ComponentFixture<RandomEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
