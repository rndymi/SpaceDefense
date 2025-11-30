import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  username: string = "";
  email: string = "";
  password: string = "";
  repeatPassword: string = "";

  errorMessage: string = "";

  @ViewChild('snackbar', { static: false }) snackbar!: ElementRef;

  constructor(
    private userService: User,
    private router: Router
  ) { }

  createAccount() {
    this.errorMessage = "";

    if (!this.username) {
      this.errorMessage = 'username';
      return;
    }
    if (!this.email) {
      this.errorMessage = 'email';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'password';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'password';
      return;
    }
    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'repeat';
      return;
    }

    this.userService.registerUser(this.username, this.email, this.password)
      .subscribe({
        next: () => {
          this.showSnackbar("✔ Account created successfully!", "success");

          this.username = "";
          this.email = "";
          this.password = "";
          this.repeatPassword = "";

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        },
        error: (msg) => {
          this.showSnackbar(msg, "error");
        }
      });
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