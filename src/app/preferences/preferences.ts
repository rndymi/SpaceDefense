import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayState } from '../shared/services/play-state';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class Preferences {
  ufos: number = 1;
  timer: number = 60;

  @ViewChild('snackbar', { static: false }) snackbar!: ElementRef;

  constructor(
    private router: Router,
    private playState: PlayState
  ) {}

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
    const prefs = {
      numUFOs: this.ufos,
      gameTime: this.timer
    };

    sessionStorage.setItem("Prefs", JSON.stringify(prefs));
    this.playState.clear();

    this.updateSliderColor();
    this.showSnackbar("Preferences saved!", "success");

    //console.log("Preferences saved:", prefs);
    setTimeout(() => {

      sessionStorage.removeItem("PlayState");

      this.router.navigate(['/play']);
    }, 2000);
}
  
  private showSnackbar(
      message: string, 
      type: "success" | "error" | "warning" | "info" = "success"
  ) {

    if (!this.snackbar) return;
    const sb = this.snackbar.nativeElement;

    sb.classList.remove("success", "error", "warning", "info");

    sb.querySelector(".snackbar-message").textContent = message;

    sb.classList.add(type);
    sb.classList.add("show");

    setTimeout(() => {
        sb.classList.remove("show");
    }, 2400);
  }

}
