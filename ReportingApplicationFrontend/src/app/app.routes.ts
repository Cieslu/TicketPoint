import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authenticationGuard } from './guards/authentication/authentication.guard';
import { UsersComponent } from './components/users/users.component';
import { AdministratorHomeComponent } from './components/administrator-home/administrator-home.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { WorkerHomeComponent } from './components/worker-home/worker-home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageForbiddenComponent } from './components/page-forbidden/page-forbidden.component';
import { authenticationChildrenGuard } from './guards/children-guards/authentication-children/authentication-children.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent, title: 'Logowanie'},

    // {path: 'administrator/home', component: AdministratorHomeComponent, title: 'Lista użytkowników', canActivate: [authenticationGuard, authorizationGuard],  data: { role: 'Administrator'},},
    // {path: 'administrator/users', component: UsersComponent, title: 'Lista użytkowników', canActivate: [authenticationGuard, authorizationGuard],  data: { role: 'Administrator'},},


    {
        path: 'administrator', 
        canActivate: [authenticationGuard],
        canActivateChild: [authenticationChildrenGuard],
        data: { role: 'Administrator'},
        children: [
            {
                title: 'Strona główna', 
                path: 'home', 
                component: AdministratorHomeComponent 
            },
            {
                title: 'Lista użytkowników', 
                path: 'users', 
                component: UsersComponent
            },
            {
                title: 'Zgłoszenie', 
                path: 'ticket/:ticketId', 
                component: TicketComponent
            },
        ],
    },
    {
        path: 'worker', 
        canActivate: [authenticationGuard],
        canActivateChild: [authenticationChildrenGuard],
        data: { role: 'Worker'},
        children: [
            {
                title: 'Strona główna', 
                path: 'home', 
                component: WorkerHomeComponent 
            },
        ],
    },
    { path: 'page-forbidden', component: PageForbiddenComponent },
    { path: '**', component: PageNotFoundComponent }




    // {path: 'administrator/users', component: UsersComponent, title: 'Lista użytkowników', canActivate: [authenticationGuard]},
    // {path: 'administrator/ticket/:ticketId', component: TicketComponent, title: 'Zgłoszenie', canActivate: [authenticationGuard]},
    
    // {path: 'worker/home', component: WorkerHomeComponent, title: 'Strona główna', canActivate: [authenticationGuard]},
];
