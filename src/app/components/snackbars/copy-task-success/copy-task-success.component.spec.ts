import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyTaskSuccessComponent } from './copy-task-success.component';

describe('CopyTaskSuccessComponent', () => {
  let component: CopyTaskSuccessComponent;
  let fixture: ComponentFixture<CopyTaskSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyTaskSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyTaskSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
