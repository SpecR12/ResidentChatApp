import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const hasAccess = sessionStorage.getItem('blockAccess') === 'true';
  const user = localStorage.getItem('user');

  if (!hasAccess) return router.createUrlTree(['/check-code']);
  if (!user) return router.createUrlTree(['/auth']);

  return true;
};
