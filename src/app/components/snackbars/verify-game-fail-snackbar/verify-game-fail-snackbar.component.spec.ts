import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyGameFailSnackbarComponent } from './verify-game-fail-snackbar.component';

describe('VerifyGameFailSnackbarComponent', () => {
  let component: VerifyGameFailSnackbarComponent;
  let fixture: ComponentFixture<VerifyGameFailSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyGameFailSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyGameFailSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
