import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupressLinkedFileDialogComponent } from './supress-linked-file-dialog.component';

describe('SupressLinkedFileDialogComponent', () => {
  let component: SupressLinkedFileDialogComponent;
  let fixture: ComponentFixture<SupressLinkedFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupressLinkedFileDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupressLinkedFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
