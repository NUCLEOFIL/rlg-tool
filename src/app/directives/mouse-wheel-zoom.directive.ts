import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMouseWheelZoom]'
})
export class MouseWheelZoomDirective {

  private zoom: number = 1;
  private element: HTMLElement;

  constructor(private elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomLevel = event.deltaY < 0 ? 0.1 : -0.1;
    this.zoom += zoomLevel;
    this.element.style.transform = `scale(${this.zoom})`;
  }
}