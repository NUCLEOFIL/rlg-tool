import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContextComponent } from './game-context.component';

describe('GameContextComponent', () => {
  let component: GameContextComponent;
  let fixture: ComponentFixture<GameContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameContextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
