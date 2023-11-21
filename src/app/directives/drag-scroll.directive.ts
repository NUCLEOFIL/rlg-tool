import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { TutorialService } from '../services/tutorial/tutorial.service';
import { Scenario } from '../class/scenario/scenario';
import { Trace } from '../class/trace/trace';

@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective {
  private isMouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private element: HTMLElement;
  @Input() scenario: Scenario = new Scenario();

  constructor(private elementRef: ElementRef, private tutorialService: TutorialService) {
    this.element = elementRef.nativeElement;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.element.style.cursor = 'grabbing';
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
    this.element.style.cursor = 'grab';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if(this.isMouseDown) {
      event.preventDefault();
      const x = event.clientX - this.startX;
      const y = event.clientY - this.startY;
      this.element.scrollLeft -= x;
      this.element.scrollTop -= y;
      this.startX = event.clientX;
      this.startY = event.clientY;
      if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 1) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
        this.tutorialService.validPhase();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (document.activeElement!.tagName.toLowerCase() !== 'input' && document.activeElement!.tagName.toLowerCase() !== 'textarea') {
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (arrowKeys.includes(event.key)) {
        event.preventDefault();
        const distance = 50;
        if (event.key === 'ArrowUp') {
          this.element.scrollBy(0, -distance);
        } else if (event.key === 'ArrowDown') {
          this.element.scrollBy(0, distance);
        } else if (event.key === 'ArrowLeft') {
          this.element.scrollBy(-distance, 0);
        } else if (event.key === 'ArrowRight') {
          this.element.scrollBy(distance, 0);
        }
        if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 1) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
          this.tutorialService.validPhase();
        }
      }
    }
  }
}