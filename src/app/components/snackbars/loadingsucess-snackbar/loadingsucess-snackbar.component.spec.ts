import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingsucessSnackbarComponent } from './loadingsucess-snackbar.component';

describe('LoadingsucessSnackbarComponent', () => {
  let component: LoadingsucessSnackbarComponent;
  let fixture: ComponentFixture<LoadingsucessSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingsucessSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingsucessSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
