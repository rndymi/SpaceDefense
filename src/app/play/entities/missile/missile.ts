import { Component, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-missile',
  standalone: true,
  imports: [],
  templateUrl: './missile.html',
  styleUrl: './missile.css',
})
export class Missile implements AfterViewInit {

  @ViewChild('missileElement') missileElement!: ElementRef<HTMLElement>;

  @Input() startLeft: number = 300;
  @Input() startBottom: number = 10;

  ngAfterViewInit() {
    const m = this.missileElement.nativeElement;
    m.style.left = this.startLeft + 'px';
    m.style.bottom = this.startBottom + 'px';
  }

  getElement(): HTMLElement {
    return this.missileElement.nativeElement;
  }

}
