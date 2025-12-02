import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../services/auth-state';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = () => {
  
  const authState = inject(AuthState);
  const router = inject(Router);

  if (authState.isLogged()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
