import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Tokenmgr {

  private readonly KEY = 'token';

  saveToken(token: string): void {
    sessionStorage.setItem(this.KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.KEY);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.KEY);
  }
  
}
