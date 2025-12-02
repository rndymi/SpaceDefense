import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../shared/services/user';
import { ChangeDetectorRef } from '@angular/core';

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

  userNameExists = false;
  userNameFree = false;
  userNameChecked = false;
  private lastCheckedValue: string | null = null;


  @ViewChild('snackbar', { static: false }) snackbar!: ElementRef;

  constructor(
    private userService: User,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  
  checkUsername() {
  const trimmed = (this.username || "").trim();

  if (!trimmed) {
    this.userNameChecked = false;
    this.userNameExists = false;
    this.userNameFree = false;
    this.lastCheckedValue = null;
    this.cdr.detectChanges();
    return;
  }

  if (trimmed === this.lastCheckedValue) return;

  this.lastCheckedValue = trimmed;

  this.userNameChecked = true;
  this.userNameExists = false;
  this.userNameFree = false;
  this.cdr.detectChanges();

  const MIN_DURATION = 500;
  const startTime = Date.now();

  this.userService.checkUserExists(trimmed)
    .subscribe({
      next: () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DURATION - elapsed);

        setTimeout(() => {
          this.userNameChecked = false;
          this.userNameExists = true;
          this.userNameFree = false;
          this.cdr.detectChanges();
        }, remaining);
      },
      error: (err) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DURATION - elapsed);

        setTimeout(() => {
          if (err.status === 404) {
            this.userNameExists = false;
            this.userNameFree = true;
          } else {
            console.error("Error checking username", err);
          }
          this.userNameChecked = false;
          this.cdr.detectChanges();
        }, remaining);
      }
    });

  }

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