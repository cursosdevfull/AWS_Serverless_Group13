import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Confirm } from './confirm/confirm';


export const routes: Routes = [
    { path: "home", component: Home },
    { path: "login", component: Login },
    { path: "register", component: Register },
    { path: "confirm", component: Confirm },
    { path: "**", redirectTo: "/register" }
];
