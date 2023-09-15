import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierSnackbarComponent } from './identifier-snackbar.component';

describe('IdentifierSnackbarComponent', () => {
  let component: IdentifierSnackbarComponent;
  let fixture: ComponentFixture<IdentifierSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifierSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifierSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
