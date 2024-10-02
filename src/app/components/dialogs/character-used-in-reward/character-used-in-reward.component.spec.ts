import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterUsedInRewardComponent } from './character-used-in-reward.component';

describe('CharacterUsedInRewardComponent', () => {
  let component: CharacterUsedInRewardComponent;
  let fixture: ComponentFixture<CharacterUsedInRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterUsedInRewardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterUsedInRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
