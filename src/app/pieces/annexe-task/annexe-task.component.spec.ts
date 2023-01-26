import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexeTaskComponent } from './annexe-task.component';

describe('AnnexeTaskComponent', () => {
  let component: AnnexeTaskComponent;
  let fixture: ComponentFixture<AnnexeTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexeTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnexeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
