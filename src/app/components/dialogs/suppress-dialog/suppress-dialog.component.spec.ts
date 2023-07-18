import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuppressDialogComponent } from './suppress-dialog.component';

describe('SuppressDialogComponent', () => {
  let component: SuppressDialogComponent;
  let fixture: ComponentFixture<SuppressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
