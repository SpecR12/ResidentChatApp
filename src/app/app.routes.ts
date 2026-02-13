import { Routes } from '@angular/router';
import { CheckCode} from './components/check-code/check-code';
import { Auth } from './components/auth/auth';
import { Mainframe } from './components/mainframe/mainframe';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'mainframe', pathMatch: 'full' },
  { path: 'check-code', component: CheckCode },
  { path: 'auth', component: Auth },
  { path: 'mainframe', component: Mainframe, canActivate: [authGuard] }
];
