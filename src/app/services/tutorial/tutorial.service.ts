import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  phase: number = 1;
  isActive: boolean = true;
  optionnalPhase: string = '';
  phaseDone: boolean[] = [];
  validationFeedback: string = '';

  constructor() {
    for(let i = 0; i < 9; i++) {
      this.phaseDone[i] = false;
    }
  }

  validPhase(): void {
    this.phaseDone[this.phase-1] = true;
    if (this.phase < 9) {
      this.phase++;   
    }
    this.validationFeedback = 'validation';
    setTimeout(() => {
      this.validationFeedback = '';
    }, 500);   
  }

  isDone(): boolean {
    return this.phaseDone.some(phase => false);
  }
}
