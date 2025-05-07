import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WindowService } from '../../../Services/Window/window.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  currentIndex = 0;
  isTransitioning = false;

  private interval = 3000;
  private requestId: number | null = null;
  private lastTime = 0;
  private window: any;

  constructor(private windowRef: WindowService) {
    this.window = this.windowRef.nativeWindow;
  }

  ngOnInit() {
    if (this.window) {
      this.startAutoSwipe();
    }
  }

  ngOnDestroy() {
    if (this.window) {
      this.stopAutoSwipe();
    }
  }

  startAutoSwipe() {
    this.lastTime = this.window.performance.now();
    this.requestId = this.window.requestAnimationFrame(this.autoSwipe.bind(this));
  }

  stopAutoSwipe() {
    if (this.requestId) {
      this.window.cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }

  autoSwipe(timestamp: number) {
    const elapsed = timestamp - this.lastTime;
    if (elapsed >= this.interval) {
      this.nextImage();
      this.lastTime = timestamp;
    }
    if (this.requestId !== null) {
      this.requestId = this.window.requestAnimationFrame(this.autoSwipe.bind(this));
    }
  }

  nextImage() {
    this.currentIndex += 1;

    if (this.currentIndex === this.images.length - 1) {
      setTimeout(() => {
        this.currentIndex = 0;
      }, 500);
    } else {
      setTimeout(() => {
      }, 500);
    }
  }

  getTranslateX(): string {
    const offset = this.currentIndex * -84.5;
    return `translateX(${offset}%)`;
  }
}
