import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedFilesComponent } from './linked-files.component';

describe('LinkedFilesComponent', () => {
  let component: LinkedFilesComponent;
  let fixture: ComponentFixture<LinkedFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
