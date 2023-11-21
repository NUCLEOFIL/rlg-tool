import { Component, OnInit, Input } from '@angular/core';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Trace } from 'src/app/class/trace/trace';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  optionnalExpanded: string = 'hide';

  constructor(protected tutorialService: TutorialService) { }

  ngOnInit(): void {
  }

  onClickOptionnal(): void {
    if (this.optionnalExpanded == 'hide') {
      this.optionnalExpanded = 'show';
    } else {
      this.optionnalExpanded = 'hide';
    }
  }

  onClickNext(): void {
    this.scenario.traces.push(new Trace(this.scenario.traces.length, 'next', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
    if (this.tutorialService.phase < 9) {
      this.tutorialService.phase++;
    }
    this.tutorialService.optionnalPhase = '';
  }

  onClickPrevious(): void {
    this.scenario.traces.push(new Trace(this.scenario.traces.length, 'previous', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
    if (this.tutorialService.phase > 1) {
      this.tutorialService.phase--;
    }
    this.tutorialService.optionnalPhase = '';
  }

  setOptionnalPhase(phase: string): void {
    this.tutorialService.optionnalPhase = phase;
    this.scenario.traces.push(new Trace(this.scenario.traces.length, 'view_optionnal', undefined, undefined, 'phase_'+phase, 'Tutorial'));
  }

  closeTutorialTrace(): void {
    this.scenario.traces.push(new Trace(this.scenario.traces.length, 'close', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
  }

  resumeClassicTrace(): void {
    this.scenario.traces.push(new Trace(this.scenario.traces.length, 'resume_classic', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
  }
}
