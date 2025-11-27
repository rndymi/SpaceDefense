import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor() { }

  createAccount() {
    this.errorMessage = "";

    if (!this.username || !this.email || !this.password || !this.repeatPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.showSnackbar();

    this.username = "";
    this.email = "";
    this.password = "";
    this.repeatPassword = "";

  }

  private showSnackbar() {
    if (!this.snackbar) return;

    const sb = this.snackbar.nativeElement;
    sb.classList.add('show');

    setTimeout(() => {
      sb.classList.remove('show');
    }, 2400);
  }

}