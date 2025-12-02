import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthState } from '../shared/services/auth-state';
import { CommonModule } from '@angular/common';
import { AuthTimePipe } from '../shared/pipes/auth-time-pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthTimePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';

  @ViewChild('snackbar', { static: false }) snackbar!: ElementRef;

  constructor(private authState: AuthState) {}

  get auth$() {
    return this.authState.authState$;
  }

  doLogin(): void {
  this.authState.login(this.username, this.password)
    .subscribe({
      next: (token: string) => {

        this.authState.onLoginSuccess(this.username, token);
        this.showSnackbar("✔ Login successful!", "success");
        
        const pending = sessionStorage.getItem("pendingGameRecord");

        if (pending) {
          setTimeout(() => {
            window.location.href = '/play';
          }, 1000);

        } 
      },
      error: () => {
        this.showSnackbar("✘ Login failed. Please try again.", "error");
      }
    });
  }


  logout() {
    this.authState.logout();
    this.showSnackbar("✔ Logged out successfully.", "info");
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
    }, 2500);
  }

}
