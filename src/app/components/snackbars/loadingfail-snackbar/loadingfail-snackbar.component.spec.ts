import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingfailSnackbarComponent } from './loadingfail-snackbar.component';

describe('LoadingfailSnackbarComponent', () => {
  let component: LoadingfailSnackbarComponent;
  let fixture: ComponentFixture<LoadingfailSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingfailSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingfailSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
