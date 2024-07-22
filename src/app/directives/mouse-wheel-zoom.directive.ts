import { Directive, HostListener, Input } from '@angular/core';
import { ZoomService } from '../services/zoom/zoom.service';
import { MinimapService } from '../services/minimap/minimap.service';
import { TutorialService } from '../services/tutorial/tutorial.service';
import { Scenario } from '../class/scenario/scenario';
import { Trace } from '../class/trace/trace';

@Directive({
  selector: '[appMouseWheelZoom]'
})
export class MouseWheelZoomDirective {

  @Input() scenario: Scenario = new Scenario();

  constructor(private zoomService: ZoomService, private minimapService: MinimapService, private tutorialService: TutorialService) { }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    let zoomLevel: number = 0;
    if (event.deltaY < 0) {
      if (this.zoomService.zoom <= 1.5) {
        zoomLevel = 0.010;
      }
    } else if (this.zoomService.zoom >= 0.3) {
      zoomLevel = -0.010;
    }
    this.zoomService.zoom += zoomLevel;
    this.minimapService.reset();
    if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 2) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
      this.tutorialService.validPhase();
    }
  }
}