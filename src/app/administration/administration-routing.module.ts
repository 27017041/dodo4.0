/**
 * Created by Leo on 2017/11/23.
 */
import { RouterModule, Routes } from '@angular/router';
import {AdministrationComponent} from "./administration.component";
import {UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import {AssignComponent} from "./assign/assign.component";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginComponent} from "./login/login.component";

export const AdminRoutes:Routes = [
    {
        path:'',
        component:AdministrationComponent,
        children:[
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'user', component:UserComponent },
            { path: 'role', component:RoleComponent },
            { path: 'assign', component:AssignComponent },
            { path: 'registration', component:RegistrationComponent },
            { path: 'login', component:LoginComponent }
        ]
    }
];

export const AdministrationRoutingModule = RouterModule.forChild(AdminRoutes);