import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-ufo',
  standalone: true,
  imports: [],
  templateUrl: './ufo.html',
  styleUrl: './ufo.css',
})
export class Ufo implements AfterViewInit {

  @ViewChild('ufoElement') ufoElement!: ElementRef<HTMLImageElement>;

  @Input() startLeft: number = 0;
  @Input() startBottom: number = 500;
  @Input() size: number = 80;

  ngAfterViewInit() {
    const e = this.ufoElement.nativeElement;
    e.style.left = this.startLeft + 'px';
    e.style.bottom = this.startBottom + 'px';
    e.style.width = this.size + 'px';
    e.style.height = this.size + 'px';
  }

  getElement(): HTMLElement {
    return this.ufoElement.nativeElement;
  }

  playExplosion() {
    const e = this.ufoElement.nativeElement;
    e.src = 'assets/imgs/sprites/explosion.gif';
    setTimeout(() => e.src = 'assets/imgs/sprites/ufo.svg', 500);
  }

}
