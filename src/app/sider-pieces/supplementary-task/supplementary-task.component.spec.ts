import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryTaskComponent } from './supplementary-task.component';

describe('SupplementaryTaskComponent', () => {
  let component: SupplementaryTaskComponent;
  let fixture: ComponentFixture<SupplementaryTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplementaryTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplementaryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
