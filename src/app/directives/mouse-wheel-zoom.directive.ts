import { Directive, ElementRef, HostListener } from '@angular/core';
import { ZoomService } from '../services/zoom/zoom.service';

@Directive({
  selector: '[appMouseWheelZoom]'
})
export class MouseWheelZoomDirective {

  private element: HTMLElement;

  constructor(private elementRef: ElementRef, private zoomService: ZoomService) {
    this.element = elementRef.nativeElement;
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    let zoomLevel: number = 0;
    if (event.deltaY < 0) {
      zoomLevel = 0.1
    } else if (this.zoomService.zoom > 0.3) {
      zoomLevel = -0.1
    }
    this.zoomService.zoom += zoomLevel;
    this.element.style.transform = `scale(${this.zoomService.zoom})`;
  }
}