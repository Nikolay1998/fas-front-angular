import { Routes } from '@angular/router';
import { authGuard } from './_helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { NodeListComponent } from './node-list/node-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: NodeListComponent, canActivate: [authGuard] }
];
