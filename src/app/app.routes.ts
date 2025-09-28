import { Routes } from '@angular/router';
import { UserContainer } from './users/components/user-container/user-container';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UserContainer },
    { path: '**', redirectTo: 'users' }
];
