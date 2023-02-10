import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective {
  private isMouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private element: HTMLElement;

  constructor(private elementRef: ElementRef) {
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
    }
  }
}