import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionContextComponent } from './mission-context.component';

describe('MissionContextComponent', () => {
  let component: MissionContextComponent;
  let fixture: ComponentFixture<MissionContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionContextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
