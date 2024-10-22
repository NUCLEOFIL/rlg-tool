import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformSentenceDialogComponent } from './transform-sentence-dialog.component';

describe('TransformSentenceDialogComponent', () => {
  let component: TransformSentenceDialogComponent;
  let fixture: ComponentFixture<TransformSentenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformSentenceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformSentenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
