import { Component, Input, AfterViewInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss']
})
export class MinimapComponent implements AfterViewInit, OnDestroy {
  @Input() targetDiv!: HTMLElement;
  @ViewChild('minimapContent') minimapContent!: ElementRef;
  @ViewChild('highlight') highlight!: ElementRef;

  private scale: number = 0.075;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private refreshSubscription!: Subscription;
  private scrollListener: () => void = () => {};
  private autoScrollInterval: any;
  private isMinimapDragging: boolean = false;
  private minimapStartScrollLeft: number = 0;
  private minimapStartScrollTop: number = 0;

  constructor(private renderer: Renderer2, private minimapService: MinimapService) {}

  ngAfterViewInit(): void {
    if (this.targetDiv) {
      this.createMinimap();
      this.refreshSubscription = this.minimapService.refresh$.subscribe(() => {
        this.refreshMinimap();
      });
      this.initDragAndDrop();
      this.initMinimapDragScroll();
    }
  }

  createMinimap(): void {
    const clonedNode = this.targetDiv.cloneNode(true) as HTMLElement;

    this.renderer.setProperty(this.minimapContent.nativeElement, 'innerHTML', '');

    this.renderer.setStyle(clonedNode, 'width', `${this.targetDiv.scrollWidth}px`);
    this.renderer.setStyle(clonedNode, 'height', `${this.targetDiv.scrollHeight}px`);
    this.renderer.setStyle(clonedNode, 'position', 'absolute');
    this.renderer.setStyle(clonedNode, 'top', '0');
    this.renderer.setStyle(clonedNode, 'left', '0');
    this.renderer.setStyle(clonedNode, 'transform', `scale(${this.scale})`);
    this.renderer.setStyle(clonedNode, 'transform-origin', 'top left');
    this.renderer.setStyle(clonedNode, 'pointer-events', 'none');

    this.renderer.appendChild(this.minimapContent.nativeElement, clonedNode);
    
    this.updateHighlight();

    this.initScrollSync();
  }

  refreshMinimap(): void {
    this.createMinimap();
  }

  initScrollSync(): void {
    this.targetDiv.removeEventListener('scroll', this.scrollListener);
    this.scrollListener = () => this.updateHighlight();
    this.targetDiv.addEventListener('scroll', this.scrollListener);
  }

  updateHighlight(): void {
    if (this.targetDiv && this.minimapContent.nativeElement) {
      const scrollTop = this.targetDiv.scrollTop;
      const scrollLeft = this.targetDiv.scrollLeft;
      const clientHeight = this.targetDiv.clientHeight;
      const clientWidth = this.targetDiv.clientWidth;
      const scrollHeight = this.targetDiv.scrollHeight;
      const scrollWidth = this.targetDiv.scrollWidth;

      const minimapHeight = this.minimapContent.nativeElement.scrollHeight;
      const minimapWidth = this.minimapContent.nativeElement.scrollWidth;

      const highlightHeight = (clientHeight / scrollHeight) * minimapHeight;
      const highlightWidth = (clientWidth / scrollWidth) * minimapWidth;

      const highlightTop = (scrollTop / scrollHeight) * minimapHeight;
      const highlightLeft = (scrollLeft / scrollWidth) * minimapWidth;

      this.renderer.setStyle(this.highlight.nativeElement, 'height', `${highlightHeight}px`);
      this.renderer.setStyle(this.highlight.nativeElement, 'width', `${highlightWidth}px`);
      this.renderer.setStyle(this.highlight.nativeElement, 'top', `${highlightTop}px`);
      this.renderer.setStyle(this.highlight.nativeElement, 'left', `${highlightLeft}px`);
    }
  }

  initDragAndDrop(): void {
    const highlightElement = this.highlight.nativeElement;

    this.renderer.listen(highlightElement, 'mousedown', (event: MouseEvent) => {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      
      this.renderer.addClass(highlightElement, 'dragging');
      
      event.preventDefault();
    });

    this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
      if (!this.isDragging) return;

      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      const currentTop = parseFloat(this.highlight.nativeElement.style.top) || 0;
      const currentLeft = parseFloat(this.highlight.nativeElement.style.left) || 0;

      const newTop = currentTop + deltaY;
      const newLeft = currentLeft + deltaX;

      const minimapHeight = this.minimapContent.nativeElement.scrollHeight;
      const minimapWidth = this.minimapContent.nativeElement.scrollWidth;

      const highlightHeight = this.highlight.nativeElement.offsetHeight;
      const highlightWidth = this.highlight.nativeElement.offsetWidth;

      const clampedTop = Math.max(0, Math.min(newTop, minimapHeight - highlightHeight));
      const clampedLeft = Math.max(0, Math.min(newLeft, minimapWidth - highlightWidth));

      this.renderer.setStyle(this.highlight.nativeElement, 'top', `${clampedTop}px`);
      this.renderer.setStyle(this.highlight.nativeElement, 'left', `${clampedLeft}px`);

      const scrollTop = (clampedTop / minimapHeight) * this.targetDiv.scrollHeight;
      const scrollLeft = (clampedLeft / minimapWidth) * this.targetDiv.scrollWidth;

      this.targetDiv.scrollTop = scrollTop;
      this.targetDiv.scrollLeft = scrollLeft;

      this.startX = event.clientX;
      this.startY = event.clientY;

      this.autoScrollMinimap(event.clientX, event.clientY);
    });

    this.renderer.listen(document, 'mouseup', () => {
      this.isDragging = false;
      this.renderer.removeClass(this.highlight.nativeElement, 'dragging');
      clearInterval(this.autoScrollInterval);
    });
  }

  autoScrollMinimap(mouseX: number, mouseY: number): void {
    const minimapContainer = this.minimapContent.nativeElement.parentElement as HTMLElement;
    const minimapRect = minimapContainer.getBoundingClientRect();
    const edgeThreshold = 40;
    const scrollSpeed = 5;
  
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  
    this.autoScrollInterval = setInterval(() => {
      if (!this.isDragging) {
        clearInterval(this.autoScrollInterval);
        return;
      }
  
      let scrolled = false;
      let deltaX = 0;
      let deltaY = 0;
  
      if (mouseY < minimapRect.top + edgeThreshold) {
        minimapContainer.scrollTop -= scrollSpeed;
        deltaY = -scrollSpeed;
        scrolled = true;
      } else if (mouseY > minimapRect.bottom - edgeThreshold) {
        minimapContainer.scrollTop += scrollSpeed;
        deltaY = scrollSpeed;
        scrolled = true;
      }
  
      if (mouseX < minimapRect.left + edgeThreshold) {
        minimapContainer.scrollLeft -= scrollSpeed;
        deltaX = -scrollSpeed;
        scrolled = true;
      } else if (mouseX > minimapRect.right - edgeThreshold) {
        minimapContainer.scrollLeft += scrollSpeed;
        deltaX = scrollSpeed;
        scrolled = true;
      }
  
      if (scrolled) {
        const currentTop = parseFloat(this.highlight.nativeElement.style.top) || 0;
        const currentLeft = parseFloat(this.highlight.nativeElement.style.left) || 0;
  
        const newTop = currentTop + deltaY;
        const newLeft = currentLeft + deltaX;
  
        const minimapHeight = this.minimapContent.nativeElement.scrollHeight;
        const minimapWidth = this.minimapContent.nativeElement.scrollWidth;
  
        const highlightHeight = this.highlight.nativeElement.offsetHeight;
        const highlightWidth = this.highlight.nativeElement.offsetWidth;
  
        const clampedTop = Math.max(0, Math.min(newTop, minimapHeight - highlightHeight));
        const clampedLeft = Math.max(0, Math.min(newLeft, minimapWidth - highlightWidth));
  
        this.renderer.setStyle(this.highlight.nativeElement, 'top', `${clampedTop}px`);
        this.renderer.setStyle(this.highlight.nativeElement, 'left', `${clampedLeft}px`);
  
        const scrollTop = (clampedTop / minimapHeight) * this.targetDiv.scrollHeight;
        const scrollLeft = (clampedLeft / minimapWidth) * this.targetDiv.scrollWidth;
  
        this.targetDiv.scrollTop = scrollTop;
        this.targetDiv.scrollLeft = scrollLeft;
      }
    }, 20);
  }

  initMinimapDragScroll(): void {
    const minimapContainer = this.minimapContent.nativeElement.parentElement as HTMLElement;

    this.renderer.listen(minimapContainer, 'mousedown', (event: MouseEvent) => {
      if (this.isDragging) return;

      this.isMinimapDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;

      this.minimapStartScrollLeft = minimapContainer.scrollLeft;
      this.minimapStartScrollTop = minimapContainer.scrollTop;

      event.preventDefault();
    });

    this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
      if (!this.isMinimapDragging) return;

      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      minimapContainer.scrollLeft = this.minimapStartScrollLeft - deltaX;
      minimapContainer.scrollTop = this.minimapStartScrollTop - deltaY;
    });

    this.renderer.listen(document, 'mouseup', () => {
      this.isMinimapDragging = false;
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.scrollListener) {
      this.targetDiv.removeEventListener('scroll', this.scrollListener);
    }

    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }
}
