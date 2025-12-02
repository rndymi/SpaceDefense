import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { User } from './user';
import { Tokenmgr } from './tokenmgr';

interface AuthStatus {
  logged: boolean;
  username: string | null;
  tokenExpiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  
  private readonly TOKEN_DURATION = 10 * 60; // 10 minutes in seconds
  private timerSub: Subscription | null = null;
  private pedingScore: any = null;

  setPendingScore(scoreData: any) {
    this.pedingScore = scoreData;
  }

  consumePendingScore() {
    const score = this.pedingScore;
    this.pedingScore = null;
    return score;
  }

  hasPendingScore(): boolean {
    return this.pedingScore !== null;
  }

  public authState = new BehaviorSubject<AuthStatus>({
    logged: false,
    username: null,
    tokenExpiresIn: 0,
  });

  authState$ = this.authState.asObservable();

  constructor(
    private userService: User,
    private tokenMgr: Tokenmgr
  ) {
    this.restoreSession();
  }

  login(username: string, password: string) {
    return this.userService.userLogin(username, password);
  }
  
  onLoginSuccess(username: string, token: string) {
    const expiration = this.TOKEN_DURATION;
    const expireAt = Date.now() + expiration * 1000;
    
    const session = { username, token, expireAt };
    sessionStorage.setItem('authSession', JSON.stringify(session));

    this.tokenMgr.saveToken(token);
    this.startCountDown();

    this.authState.next({
      logged: true,
      username,
      tokenExpiresIn: expiration
    });
  }

  private restoreSession() {
    const sessionStr = sessionStorage.getItem('authSession');
    if (!sessionStr) return;

    const session = JSON.parse(sessionStr);
    const remaining = Math.floor((session.expireAt - Date.now()) / 1000);

    if (remaining <= 0) {
      this.logout();
      return;
    }

    this.tokenMgr.saveToken(session.token);
    this.startCountDown();

    this.authState.next({
      logged: true,
      username: session.username,
      tokenExpiresIn: remaining
    });
  }

  private startCountDown() {
    if (this.timerSub) this.timerSub.unsubscribe();

    this.timerSub = interval(1000).subscribe(() => {
      const currentState = sessionStorage.getItem('authSession');
      if (!currentState) return;

      const session = JSON.parse(currentState);
      const remaining = Math.floor((session.expireAt - Date.now()) / 1000);

      if (remaining <= 0) {
        this.logout();
        return;
      }

      this.authState.next({
        logged: true,
        username: session.username,
        tokenExpiresIn: remaining
      });
    });
  }

  refreshToken(newToken: string) {
    this.tokenMgr.saveToken(newToken);

    const expireAt = Date.now() + this.TOKEN_DURATION * 1000;

    const session = sessionStorage.getItem('authSession');
    if (!session) return;

    const old = JSON.parse(session);
    old.token = newToken;
    old.expireAt = expireAt;

    sessionStorage.setItem("authSession", JSON.stringify(old));

    this.startCountDown();
    
    this.authState.next({
      logged: true,
      username: old.username,
      tokenExpiresIn: this.TOKEN_DURATION
    });
  }


  logout() {
    sessionStorage.removeItem('authSession');
    this.tokenMgr.clearToken();
    
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }

    this.authState.next({
      logged: false,
      username: null,
      tokenExpiresIn: 0
    });
  }

  isLogged(): boolean {
    return this.authState.value.logged;
  }

  getUsername(): string | null {
    return this.authState.value.username;
  }

  getToken(): string | null {
    return this.tokenMgr.getToken();
  }

}
