import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteruptComponent } from './interupt.component';

describe('InteruptComponent', () => {
  let component: InteruptComponent;
  let fixture: ComponentFixture<InteruptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteruptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteruptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
