import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../shared/services/user';
import { Tokenmgr } from '../shared/services/tokenmgr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';

  @ViewChild('snackbar', { static: false }) snackbar!: ElementRef;

  constructor(private usrMgr: User, private tokenMgr: Tokenmgr) {}

  doLogin(): void {
    this.usrMgr.userLogin(this.username, this.password)
    .subscribe({
      next: (token: string) => {
        this.tokenMgr.saveToken(token);
        this.showSnackbar("✔ Login successful!", "success");
        //console.log('Login successful, token saved.', token);
      },
      error: (err) => {
        //console.error('Login failed:', err);
        this.showSnackbar("✘ Login failed. Please try again.", "error");
      }
    });
  }

  private showSnackbar(message: string, type: "success" | "error" | "warning" | "info" = "success") {

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
