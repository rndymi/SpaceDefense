import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Preferences } from './preferences/preferences';
import { Play } from './play/play';
import { Records } from './records/records';
import { Register } from './register/register';
import { Login } from './login/login';
import { Logout } from './logout/logout';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'preferences', component: Preferences },
    { path: 'play', component: Play },
    { path: 'records', component: Records },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'logout', component: Logout },
    { path: '**', component: NotFound }
];
