import { Component, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthState } from '../shared/services/auth-state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit {

  constructor(public auth: AuthState) {}

  ngAfterViewInit(): void {

    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipElements.forEach((el: any) => {
      new (window as any).bootstrap.Tooltip(el);
    });

    const bsCollapse = new (window as any).bootstrap.Collapse('#mainNav', {
      toggle: false,
    });

    const navLinks = document.querySelectorAll(
      '.nav-link, .register-link, .access-btn, .username-text, .user-avatar'
    );

    navLinks.forEach((link: any) => {
      link.addEventListener('click', () => {
        bsCollapse.hide();
      });
    });

    document.addEventListener('click', (event) => {
      const menu = document.getElementById('mainNav');
      const burger = document.querySelector('.navbar-toggler');

      if (!menu || !burger) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const menuIsOpen = menu.classList.contains('show');
      const clickInsideMenu = menu.contains(target);
      const clickOnBurger = burger.contains(target);

      if (menuIsOpen && !clickInsideMenu && !clickOnBurger) {
        bsCollapse.hide();
      }
    });

    const burger = document.querySelector('.navbar-toggler');
    if (burger) {
      burger.addEventListener('click', () => {
        const menu = document.getElementById('mainNav');
        if (menu?.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    }

  }

  logout() {
    this.auth.logout();
  }

  goProfile() { 
    window.location.href = '/login'; 
  }

}
