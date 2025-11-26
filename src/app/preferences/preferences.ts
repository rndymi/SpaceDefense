import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class Preferences {
  ufos: number = 1;
  timer: number = 60;

  @ViewChild('snackbar') snackbar!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.updateSliderColor();
  }

  updateSliderColor() {
    const percent = (this.ufos - 1) / (5 - 1) * 100;
    document.documentElement.style.setProperty('--range-percent', percent + '%');
  }

  updateRange(event: any) {
    const el = event.target as HTMLInputElement;
    const percent = ((+el.value - +el.min) / (+el.max - +el.min)) * 100;
    el.style.setProperty("--range-percent", `${percent}%`);
  }



  savePreferences() {
    this.updateSliderColor();
    this.showSnackbar();
    
    console.log("Preferences saved:", this.ufos, this.timer);
    
  }


  
  showSnackbar() {
    const el = this.snackbar.nativeElement;
    el.classList.add('show');

    setTimeout(() => el.classList.remove('show'), 2200);
  }

}
