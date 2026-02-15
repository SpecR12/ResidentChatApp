import { inject } from '@angular/core';
import { Router } from '@angular/router';

//functie de mini-routing si de mini-security (adica sessionStorage la codul de access ca sa nu fie oameni sa aiba url de la /auth sau camera de chat, sa ii dea la /check-code ca nu au acel cod in sessionstorage)
export const authGuard = () => {
  const router = inject(Router);
  const hasAccess = sessionStorage.getItem('blockAccess') === 'true';
  const user = localStorage.getItem('user');

  //daca am in storage uri, merg mai departe
  if (!hasAccess) return router.createUrlTree(['/check-code']);
  if (!user) return router.createUrlTree(['/auth']);

  return true;
};
